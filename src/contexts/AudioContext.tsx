import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { elevenLabsClient } from '../services/ElevenLabsClient';

interface AudioContextType {
    isMuted: boolean;
    isPlaying: boolean;
    isElevenLabsEnabled: boolean;
    currentVoice: string;
    availableVoices: { id: string; name: string }[];
    toggleMute: () => void;
    playAudio: (text: string) => Promise<void>;
    stopAudio: () => void;
    toggleElevenLabs: () => void;
    setCurrentVoice: (voiceId: string) => void;
}

export const AudioContext = createContext<AudioContextType>({
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

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
    const [availableVoices, setAvailableVoices] = useState<{id: string; name: string}[]>([]);
    const [audioCache] = useState<Map<string, ArrayBuffer>>(new Map());
    
    // Speech Synthesis
    const isSpeechAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;

    // Load ElevenLabs voices on component mount
    useEffect(() => {
        const loadVoices = async () => {
            try {
                const voices = await elevenLabsClient.getAvailableVoices();
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
                // console.log('Voices loaded:', window.speechSynthesis.getVoices().length);
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
        if (!isPlaying || !isSpeechAvailable || isElevenLabsEnabled) return;

        const interval = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
                setIsPlaying(false);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isPlaying, isSpeechAvailable, isElevenLabsEnabled]);

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
    const playSpeechSynthesis = useCallback((text: string) => {
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
                // console.log('Speech synthesis started:', text);
                setIsPlaying(true);
            };

            newUtterance.onend = () => {
                // console.log('Speech synthesis ended:', text);
                setIsPlaying(false);
            };

            newUtterance.onerror = (event) => {
                // console.error('Speech synthesis error:', event);
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
            // Generate a cache key from the text and voice
            const cacheKey = `${text}_${currentVoice}`;
            
            // Check if we have this audio cached
            let audioBuffer: ArrayBuffer;
            
            if (audioCache.has(cacheKey)) {
                // console.log('Using cached audio for:', text);
                audioBuffer = audioCache.get(cacheKey)!;
            } else {
                // console.log('Fetching audio from ElevenLabs for:', text);
                // Fetch from ElevenLabs
                audioBuffer = await elevenLabsClient.textToSpeech(text, currentVoice);
                
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
            const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            
            // Set up event handlers
            audio.onplaying = () => {
                // console.log('ElevenLabs audio started playing:', text);
                setIsPlaying(true);
            };
            
            audio.onended = () => {
                // console.log('ElevenLabs audio ended:', text);
                setIsPlaying(false);
                URL.revokeObjectURL(url); // Clean up the blob URL
            };
            
            audio.onerror = (event) => {
                // console.error('ElevenLabs audio error:', event);
                setIsPlaying(false);
                URL.revokeObjectURL(url); // Clean up the blob URL
            };
            
            // Set the source and play
            audio.src = url;
            await audio.play();
            
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
            // console.log('Audio is muted, not playing');
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