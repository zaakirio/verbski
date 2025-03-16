// src/services/elevenlabsClient.ts

/**
 * Voice interface represents an available ElevenLabs voice
 */
export interface Voice {
  id: string;
  name: string;
}

// Constants and private state
const CORS_PROXY = 'https://thingproxy.freeboard.io/fetch/';
const BASE_URL = "https://elevenlabs.io";
const API_URL = CORS_PROXY + "https://api.elevenlabs.io";
let voiceCache: Voice[] | null = null;

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
        'Accept-Language': 'en-US,en;q=0.9'
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
          'Origin': BASE_URL,
          'Referer': `${BASE_URL}/`
        },
        mode: 'cors', // Make sure CORS mode is explicit
        credentials: 'omit', // Change to omit to avoid sending cookies
        body: JSON.stringify(payload)
      });
      
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
        'Accept': '*/*',
        'Origin': BASE_URL,
        'Referer': `${BASE_URL}/`
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    
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

// Define interface for the exported client
export interface ElevenLabsClient {
  textToSpeech: (text: string, voiceId?: string) => Promise<ArrayBuffer>;
  getAvailableVoices: () => Promise<Voice[]>;
}

// Export the public functions
export const elevenLabsClient: ElevenLabsClient = {
  textToSpeech,
  getAvailableVoices
};

export default elevenLabsClient;