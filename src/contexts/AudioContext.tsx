import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface Voice {
  id: string;
  name: string;
}

// AudioContext type definition
interface AudioContextType {
  isMuted: boolean;
  isPlaying: boolean;
  isElevenLabsEnabled: boolean;
  currentVoice: string;
  availableVoices: Voice[];
  toggleMute: () => void;
  playAudio: (text: string) => Promise<void>;
  stopAudio: () => void;
  toggleElevenLabs: () => void;
  setCurrentVoice: (voiceId: string) => void;
}

interface AudioProviderProps {
  children: ReactNode;
}

const AudioContext = createContext<AudioContextType>({
  isMuted: false,
  isPlaying: false,
  isElevenLabsEnabled: false,
  currentVoice: '',
  availableVoices: [],
  toggleMute: () => { },
  playAudio: async () => { },
  stopAudio: () => { },
  toggleElevenLabs: () => { },
  setCurrentVoice: () => { }
});

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  console.log("DO WE ENTER AUDIO CONTEXT")
  const [isMuted, setIsMuted] = useState<boolean>(() =>
    localStorage.getItem('verbski-audio-muted') === 'true'
  );
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // ElevenLabs specific state
  const [isElevenLabsEnabled, setIsElevenLabsEnabled] = useState<boolean>(() => 
    localStorage.getItem('verbski-elevenlabs-enabled') === 'true'
  );
  const [currentVoice, setCurrentVoice] = useState<string>(() => 
    localStorage.getItem('verbski-elevenlabs-voice') || '21m00Tcm4TlvDq8ikWAM' // Default to Rachel
  );
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);
  const [audioCache] = useState<Map<string, ArrayBuffer>>(new Map());
  
  // Speech Synthesis
  const isSpeechAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load ElevenLabs voices on component mount
  useEffect(() => {
    const loadVoices = async () => {
      try {
        console.log(`111 - ${isElevenLabsEnabled}`)
        // Use the functional client's method
        const voices = await getAvailableVoices();
        setAvailableVoices(voices);
        
        // If no voice is selected yet, set the first one as default
        if (!currentVoice && voices.length > 0) {
          setCurrentVoice(voices[0].id);
          localStorage.setItem('verbski-elevenlabs-voice', voices[0].id);
        }
      } catch (error) {
        console.error('Failed to load ElevenLabs voices:', error);
      }
    };
    
    if (isElevenLabsEnabled) {
      loadVoices();
    }
  }, [isElevenLabsEnabled, currentVoice]);

  // Initialize speech synthesis
  useEffect(() => {
    if (isSpeechAvailable && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        console.log('Voices loaded:', window.speechSynthesis.getVoices().length);
      };
    }

    return () => {
      if (isSpeechAvailable) {
        window.speechSynthesis.cancel();
      }
      
      // Clean up audio element
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [isSpeechAvailable, audioElement]);

  // Monitor speech synthesis status
  useEffect(() => {
    console.log({isElevenLabsEnabled})
    if (!isPlaying || !isSpeechAvailable || isElevenLabsEnabled) return;

    const interval = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setIsPlaying(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isSpeechAvailable, isElevenLabsEnabled]);

  interface Voice {
    id: string;
    name: string;
  }
  
  // Constants and private state
  const CORS_PROXY = 'https://thingproxy.freeboard.io/fetch/';
  const BASE_URL = "https://elevenlabs.io";
  const API_URL = CORS_PROXY + "https://api.elevenlabs.io";
  let voiceCache: Voice[] | null = null;
  console.log(API_URL)
  
  /**
   * Converts text to speech using ElevenLabs API and returns the audio as ArrayBuffer
   * 
   * @param text - The text to convert to speech
   * @param voiceId - The ID of the voice to use (defaults to Rachel)
   * @returns Promise with ArrayBuffer of the audio
   */
  async function textToSpeech(text: string, voiceId: string = "21m00Tcm4TlvDq8ikWAM"): Promise<ArrayBuffer> {
    try {
      // Try the direct API endpoint first
      const audioData = await useDirectApiEndpoint(text, voiceId);
      
      if (audioData) {
        return audioData;
      }
      
      // If that fails, try the demo endpoint
      const demoAudioData = await getAudioFromDemo(text, voiceId);
      
      if (demoAudioData) {
        return demoAudioData;
      }
      
      throw new Error("Failed to get audio from any endpoint");
    } catch (error) {
      console.error("Error in textToSpeech:", error);
      throw error;
    }
  }
  
  /**
   * Gets a list of available voices from ElevenLabs
   * 
   * @returns Promise with array of Voice objects
   */
  async function getAvailableVoices(): Promise<Voice[]> {
    if (voiceCache) {
      return voiceCache;
    }
    
    try {
      await fetchHomePage(); // Ensures we have cookies if needed
      
      // In a full implementation, we would parse these from the page
      // For now, returning the hardcoded list from the Python script
      const voices: Voice[] = [
        { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
        { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi" },
        { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella" },
        { id: "ErXwobaYiN019PkySvjV", name: "Antoni" },
        { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli" },
        { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh" },
        { id: "VR6AewLTigWG4xSOukaG", name: "Arnold" },
        { id: "pNInz6obpgDQGcFmaJgB", name: "Adam" },
        { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam" },
        { id: "XrExE9yKIg1WjnnlVkGX", name: "Demo Voice" }
      ];
      
      voiceCache = voices;
      return voices;
    } catch (error) {
      console.error("Error getting available voices:", error);
      
      // Fallback to minimal list if there's an error
      return [
        { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
        { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi" },
        { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella" }
      ];
    }
  }
  
  /**
   * Fetches the homepage to get any required cookies or tokens
   * 
   * @returns Promise that resolves when the homepage is fetched
   */
  async function fetchHomePage(): Promise<boolean> {
    try {
      const response = await fetch(BASE_URL, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch homepage: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error("Error fetching homepage:", error);
      return false;
    }
  }
  
  /**
   * Attempts to get audio using the direct API endpoint
   * 
   * @param text - The text to convert to speech
   * @param voiceId - The ID of the voice to use
   * @returns Promise with ArrayBuffer of the audio or null if failed
   */
  async function useDirectApiEndpoint(text: string, voiceId: string): Promise<ArrayBuffer | null> {
    try {
      const ttsEndpoint = `${API_URL}/v1/text-to-speech/${voiceId}?allow_unauthenticated=1`;
      
      const payload = {
        text,
        model_id: "eleven_multilingual_v2"
      };
      
      // Add detailed error logging
      try {
        const response = await fetch(ttsEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
            'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'Origin': 'http://localhost:5173',
            'Referer': 'http://localhost:5173/',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'priority': 'u=1, i'
          },
          mode: 'cors',
          credentials: 'omit',
          body: JSON.stringify(payload)
        });

        console.log({response})
        
        if (!response.ok) {
          console.warn(`Direct API request failed: ${response.status}`);
          console.warn('Response:', await response.text());
          return null;
        }
        
        const contentType = response.headers.get('Content-Type') || '';
        if (!contentType.includes('audio')) {
          console.warn(`Received non-audio response: ${contentType}`);
          return null;
        }
        
        return await response.arrayBuffer();
      } catch (fetchError) {
        console.error("Fetch error details:", fetchError);
        return null;
      }
    } catch (error) {
      console.error("Error using direct API endpoint:", error);
      return null;
    }
  }
  
  /**
   * Attempts to get audio from the website's demo functionality
   * 
   * @param text - The text to convert to speech
   * @param voiceId - The ID of the voice to use
   * @returns Promise with ArrayBuffer of the audio or null if failed
   */
  async function getAudioFromDemo(text: string, voiceId: string): Promise<ArrayBuffer | null> {
    try {
      const ttsEndpoint = `${API_URL}/v1/text-to-speech/${voiceId}?allow_unauthenticated=1`;
      
      const payload = {
        text,
        model_id: "eleven_multilingual_v2"
      };
      
      const response = await fetch(ttsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'Origin': 'http://localhost:5173',
          'Referer': 'http://localhost:5173/',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'priority': 'u=1, i'
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(payload)
      });
      console.log({response})

      if (!response.ok) {
        console.warn(`Demo request failed: ${response.status}`);
        return null;
      }
      
      const contentType = response.headers.get('Content-Type') || '';
      if (!contentType.includes('audio')) {
        console.warn(`Received non-audio response from demo: ${contentType}`);
        return null;
      }
      
      return await response.arrayBuffer();
    } catch (error) {
      console.error("Error using demo endpoint:", error);
      return null;
    }
  }


  // Toggle mute function
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newState = !prev;
      localStorage.setItem('verbski-audio-muted', newState.toString());

      if (newState) {
        if (isSpeechAvailable) {
          window.speechSynthesis.cancel();
        }
        
        if (audioElement) {
          audioElement.pause();
        }
        
        setIsPlaying(false);
      }

      return newState;
    });
  }, [isSpeechAvailable, audioElement]);

  // Toggle ElevenLabs function
  const toggleElevenLabs = useCallback(() => {
    console.log("toggle")
    setIsElevenLabsEnabled(prev => {
      const newState = !prev;
      localStorage.setItem('verbski-elevenlabs-enabled', newState.toString());
      return newState;
    });
  }, []);

  // Set voice function
  const setVoice = useCallback((voiceId: string) => {
    setCurrentVoice(voiceId);
    localStorage.setItem('verbski-elevenlabs-voice', voiceId);
  }, []);

  // Play audio using Speech Synthesis
  const playSpeechSynthesis = useCallback((text: string): boolean => {
    if (!isSpeechAvailable) return false;
    
    try {
      window.speechSynthesis.cancel();
      
      const newUtterance = new SpeechSynthesisUtterance(text);

      newUtterance.lang = 'ru-RU';
      newUtterance.rate = 0.5; // Slow rate for Russian
      newUtterance.pitch = 1;
      newUtterance.volume = 1;

      // Event handlers
      newUtterance.onstart = () => {
        console.log('Speech synthesis started:', text);
        setIsPlaying(true);
      };

      newUtterance.onend = () => {
        console.log('Speech synthesis ended:', text);
        setIsPlaying(false);
      };

      newUtterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(newUtterance);
      return true;
    } catch (error) {
      console.error('Error playing speech synthesis:', error);
      return false;
    }
  }, [isSpeechAvailable]);

  // Play audio using ElevenLabs
  const playElevenLabsAudio = useCallback(async (text: string): Promise<boolean> => {
    try {
      console.log("PLAY 11 LABWS")
      // Generate a cache key from the text and voice
      const cacheKey = `${text}_${currentVoice}`;
      
      // Check if we have this audio cached
      let audioBuffer;
      
      if (audioCache.has(cacheKey)) {
        console.log('Using cached audio for:', text);
        audioBuffer = audioCache.get(cacheKey);
      } else {
        console.log('Fetching audio from ElevenLabs for:', text);
        // Fetch from ElevenLabs using the functional client
        audioBuffer = await textToSpeech(text, currentVoice);
        
        // Cache the result
        audioCache.set(cacheKey, audioBuffer);
      }
      
      // Create a new audio element or reuse the existing one
      let audio = audioElement;
      if (!audio) {
        audio = new Audio();
        setAudioElement(audio);
      } else {
        // Stop any currently playing audio
        audio.pause();
        audio.currentTime = 0;
      }
      
      // Convert the array buffer to a Blob
      if(audioBuffer){
        const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        
        // Set up event handlers
        audio.onplaying = () => {
          console.log('ElevenLabs audio started playing:', text);
          setIsPlaying(true);
        };
        
        audio.onended = () => {
          console.log('ElevenLabs audio ended:', text);
          setIsPlaying(false);
          URL.revokeObjectURL(url); // Clean up the blob URL
        };
        
        audio.onerror = (event) => {
          console.error('ElevenLabs audio error:', event);
          setIsPlaying(false);
          URL.revokeObjectURL(url); // Clean up the blob URL
        };
        
        // Set the source and play
        audio.src = url;
        await audio.play();
      }
      return true;

    } catch (error) {
      console.error('Error playing ElevenLabs audio:', error);
      setIsPlaying(false);
      return false;
    }
  }, [audioElement, currentVoice, audioCache]);

  // Stop audio function
  const stopAudio = useCallback(() => {
    if (isSpeechAvailable) {
      window.speechSynthesis.cancel();
    }
    
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    
    setIsPlaying(false);
  }, [isSpeechAvailable, audioElement]);

  // Main play audio function
  const playAudio = useCallback(async (text: string): Promise<void> => {
    if (isMuted) {
      console.log('Audio is muted, not playing');
      return;
    }

    // Stop any currently playing audio
    stopAudio();
    
    // Try ElevenLabs first if enabled
    if (isElevenLabsEnabled) {
      const success = await playElevenLabsAudio(text);
      if (success) return;
      
      // If ElevenLabs failed, fall back to speech synthesis
      console.warn('ElevenLabs playback failed, falling back to speech synthesis');
    }
    
    // Use speech synthesis as fallback
    playSpeechSynthesis(text);
  }, [isMuted, isElevenLabsEnabled, playElevenLabsAudio, playSpeechSynthesis, stopAudio]);

  const value = {
    isMuted,
    isPlaying,
    isElevenLabsEnabled,
    currentVoice,
    availableVoices,
    toggleMute,
    playAudio,
    stopAudio,
    toggleElevenLabs,
    setCurrentVoice: setVoice
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);