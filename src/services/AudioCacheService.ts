// src/services/AudioCacheService.ts

/**
 * Service for caching audio files to improve performance
 * and reduce API calls to ElevenLabs
 */
export class AudioCacheService {
    private cache: Map<string, ArrayBuffer>;
    private persistentCache: boolean;
    private cacheKeyPrefix: string = 'verbski-audio-';
    
    /**
     * Creates a new AudioCacheService
     * @param persistentCache Whether to persist cache in localStorage (default: true)
     */
    constructor(persistentCache: boolean = true) {
      this.cache = new Map<string, ArrayBuffer>();
      this.persistentCache = persistentCache;
      
      // Load cached items from localStorage if persistent cache is enabled
      if (this.persistentCache) {
        this.loadFromLocalStorage();
      }
    }
    
    /**
     * Generates a cache key for a text and voice ID
     * @param text The text to generate speech for
     * @param voiceId The voice ID
     * @returns A unique cache key
     */
    private generateKey(text: string, voiceId: string): string {
      return `${this.cacheKeyPrefix}${voiceId}-${text}`;
    }
    
    /**
     * Gets audio from cache if available
     * @param text The text to look up
     * @param voiceId The voice ID
     * @returns The cached audio or null if not found
     */
    public get(text: string, voiceId: string): ArrayBuffer | null {
      const key = this.generateKey(text, voiceId);
      
      // Try memory cache first
      if (this.cache.has(key)) {
        return this.cache.get(key) || null;
      }
      
      // If not in memory and persistent cache is enabled, try localStorage
      if (this.persistentCache) {
        try {
          const storedItem = localStorage.getItem(key);
          if (storedItem) {
            // Convert stored base64 string back to ArrayBuffer
            const binary = atob(storedItem);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
            }
            
            const buffer = bytes.buffer;
            // Store in memory cache for faster access next time
            this.cache.set(key, buffer);
            return buffer;
          }
        } catch (error) {
          console.error('Error retrieving from persistent cache:', error);
        }
      }
      
      return null;
    }
    
    /**
     * Stores audio in the cache
     * @param text The text associated with the audio
     * @param voiceId The voice ID used to generate the audio
     * @param audio The audio data to cache
     */
    public set(text: string, voiceId: string, audio: ArrayBuffer): void {
      const key = this.generateKey(text, voiceId);
      
      // Store in memory cache
      this.cache.set(key, audio);
      
      // Store in localStorage if persistent cache is enabled
      if (this.persistentCache) {
        try {
          // Convert ArrayBuffer to base64 string for localStorage
          const bytes = new Uint8Array(audio);
          let binary = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);
          
          // Only cache if size is reasonable (< 2MB)
          if (base64.length < 2 * 1024 * 1024) {
            localStorage.setItem(key, base64);
          } else {
            console.warn('Audio file too large for persistent cache:', text);
          }
        } catch (error) {
          console.error('Error storing in persistent cache:', error);
        }
      }
    }
    
    /**
     * Clears the cache
     */
    public clear(): void {
      this.cache.clear();
      
      if (this.persistentCache) {
        // Only clear audio cache items, not other localStorage items
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(this.cacheKeyPrefix)) {
            localStorage.removeItem(key);
          }
        });
      }
    }
    
    /**
     * Loads cached items from localStorage
     */
    private loadFromLocalStorage(): void {
      try {
        // Get all keys from localStorage
    //    const keys = Object.keys(localStorage);
        
        // Filter audio cache keys
      //  const audioCacheKeys = keys.filter(key => key.startsWith(this.cacheKeyPrefix));
        
        // Report cache status
       // console.log(`Found ${audioCacheKeys.length} cached audio items in localStorage`);
        
        // We don't actually load the items into memory here to save memory
        // They will be loaded on-demand when get() is called
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    }
    
    /**
     * Gets the number of items in the cache
     * @returns The number of cached items
     */
    public size(): number {
      return this.cache.size;
    }
    
    /**
     * Gets the estimated size of the cache in bytes
     * @returns The estimated size in bytes
     */
    public estimatedSize(): number {
      let totalSize = 0;
      
      this.cache.forEach((buffer) => {
        totalSize += buffer.byteLength;
      });
      
      return totalSize;
    }
    
    /**
     * Preloads common Russian verb forms for a specific voice
     * @param commonForms Array of common verb forms to preload
     * @param voiceId The voice ID to use
     * @param textToSpeechFn The function to call to generate speech
     */
    public async preloadCommonForms(
      commonForms: string[], 
      voiceId: string,
      textToSpeechFn: (text: string, voiceId: string) => Promise<ArrayBuffer>
    ): Promise<void> {
      // console.log(`Preloading ${commonForms.length} common verb forms...`);
      
      let loaded = 0;
      const promises = commonForms.map(async (form) => {
        // Skip if already cached
        if (this.get(form, voiceId)) {
          loaded++;
          return;
        }
        
        try {
          // Generate speech and cache it
          const audio = await textToSpeechFn(form, voiceId);
          this.set(form, voiceId, audio);
          loaded++;
          
          // Log progress every 10 items
          if (loaded % 10 === 0) {
          ///  console.log(`Preloaded ${loaded}/${commonForms.length} common forms`);
          }
        } catch (error) {
        //  console.error(`Error preloading form "${form}":`, error);
        }
      });
      
      await Promise.all(promises);
     // console.log(`Preloading complete. Cached ${loaded}/${commonForms.length} common forms.`);
    }
  }
  
  // Singleton instance
  export const audioCacheService = new AudioCacheService();
  export default audioCacheService;