import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';

interface AudioContextType {
    isMuted: boolean;
    isPlaying: boolean;
    toggleMute: () => void;
    playAudio: (infinitive: string, pronoun: string) => Promise<void>;
    stopAudio: () => void;
    preloadVerb: (infinitive: string) => void;
}

export const AudioContext = createContext<AudioContextType>({
    isMuted: false,
    isPlaying: false,
    toggleMute: () => { },
    playAudio: async () => { },
    stopAudio: () => { },
    preloadVerb: () => { }
});

// Pronoun keys for preloading all conjugations
const PRONOUNS = ['ya', 'ti', 'on_ona_ono', 'mi', 'vi', 'oni'];

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState<boolean>(() =>
        localStorage.getItem('verbski-audio-muted') === 'true'
    );

    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    // Audio element pool for better performance
    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const preloadCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());

    // Initialize audio element
    useEffect(() => {
        audioElementRef.current = new Audio();

        return () => {
            // Clean up audio element
            if (audioElementRef.current) {
                audioElementRef.current.pause();
                audioElementRef.current.src = '';
            }

            // Clean up preload cache
            preloadCacheRef.current.forEach(audio => {
                audio.pause();
                audio.src = '';
            });
            preloadCacheRef.current.clear();
        };
    }, []);

    // Toggle mute function
    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const newState = !prev;
            localStorage.setItem('verbski-audio-muted', newState.toString());

            if (newState && audioElementRef.current) {
                audioElementRef.current.pause();
                setIsPlaying(false);
            }

            return newState;
        });
    }, []);

    // Construct audio file path
    const getAudioPath = useCallback((infinitive: string, pronoun: string): string => {
        return `/audio/${infinitive}_${pronoun}.mp3`;
    }, []);

    // Preload all conjugations for a verb
    const preloadVerb = useCallback((infinitive: string) => {
        // Preload all 6 conjugations in the background
        PRONOUNS.forEach(pronoun => {
            const key = `${infinitive}_${pronoun}`;

            // Skip if already preloaded
            if (preloadCacheRef.current.has(key)) return;

            const audio = new Audio();
            const path = getAudioPath(infinitive, pronoun);

            // Preload the audio
            audio.preload = 'auto';
            audio.src = path;

            // Store in cache
            preloadCacheRef.current.set(key, audio);

            // Clean up old cache entries (keep last 3 verbs = 18 files)
            if (preloadCacheRef.current.size > 18) {
                const firstKey = preloadCacheRef.current.keys().next().value;
                if (firstKey) {
                    const oldAudio = preloadCacheRef.current.get(firstKey);
                    if (oldAudio) {
                        oldAudio.pause();
                        oldAudio.src = '';
                    }
                    preloadCacheRef.current.delete(firstKey);
                }
            }
        });
    }, [getAudioPath]);

    // Stop audio function
    const stopAudio = useCallback(() => {
        if (audioElementRef.current) {
            audioElementRef.current.pause();
            audioElementRef.current.currentTime = 0;
        }
        setIsPlaying(false);
    }, []);

    // Main play audio function
    const playAudio = useCallback(async (infinitive: string, pronoun: string): Promise<void> => {
        if (isMuted) {
            console.log('Audio is muted, not playing');
            return;
        }

        if (!audioElementRef.current) {
            console.error('Audio element not initialized');
            return;
        }

        // Stop any currently playing audio
        stopAudio();

        const key = `${infinitive}_${pronoun}`;
        const audioPath = getAudioPath(infinitive, pronoun);

        try {
            // Check if audio is preloaded
            const preloadedAudio = preloadCacheRef.current.get(key);

            if (preloadedAudio) {
                // Use preloaded audio
                console.log('Using preloaded audio for:', audioPath);

                // Set up event handlers
                preloadedAudio.onplaying = () => {
                    console.log('Audio started playing:', audioPath);
                    setIsPlaying(true);
                };

                preloadedAudio.onended = () => {
                    console.log('Audio ended:', audioPath);
                    setIsPlaying(false);
                };

                preloadedAudio.onerror = (event) => {
                    console.error('Audio error:', event);
                    setIsPlaying(false);
                };

                // Reset and play
                preloadedAudio.currentTime = 0;
                await preloadedAudio.play();
            } else {
                // Load and play directly
                console.log('Loading audio:', audioPath);

                const audio = audioElementRef.current;

                // Set up event handlers
                audio.onplaying = () => {
                    console.log('Audio started playing:', audioPath);
                    setIsPlaying(true);
                };

                audio.onended = () => {
                    console.log('Audio ended:', audioPath);
                    setIsPlaying(false);
                };

                audio.onerror = (event) => {
                    console.error('Audio error for', audioPath, ':', event);
                    setIsPlaying(false);
                };

                // Set the source and play
                audio.src = audioPath;
                await audio.play();
            }
        } catch (error) {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
        }
    }, [isMuted, stopAudio, getAudioPath]);

    const value = {
        isMuted,
        isPlaying,
        toggleMute,
        playAudio,
        stopAudio,
        preloadVerb
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
