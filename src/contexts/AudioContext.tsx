import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';

type SoundEffectType = 'hover' | 'correct' | 'wrong';

interface AudioContextType {
    isMuted: boolean;
    isPlaying: boolean;
    toggleMute: () => void;
    playAudio: (infinitive: string, pronoun: string) => Promise<void>;
    stopAudio: () => void;
    preloadVerb: (infinitive: string) => void;
    playSoundEffect: (type: SoundEffectType) => void;
}

export const AudioContext = createContext<AudioContextType>({
    isMuted: false,
    isPlaying: false,
    toggleMute: () => { },
    playAudio: async () => { },
    stopAudio: () => { },
    preloadVerb: () => { },
    playSoundEffect: () => { }
});

// Pronoun keys for preloading all conjugations
const PRONOUNS = ['ya', 'ti', 'on_ona_ono', 'mi', 'vi', 'oni'];

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState<boolean>(() =>
        localStorage.getItem('verbski-audio-muted') === 'true'
    );

    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    // Use ref to track muted state for stable callbacks
    const isMutedRef = useRef(isMuted);
    useEffect(() => {
        isMutedRef.current = isMuted;
    }, [isMuted]);

    // Audio element pool for better performance
    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const preloadCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());

    // Web Audio API context for sound effects
    const webAudioCtxRef = useRef<AudioContext | null>(null);

    // Initialize audio elements
    useEffect(() => {
        audioElementRef.current = new Audio();

        // Initialize Web Audio API for sound effects
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
            webAudioCtxRef.current = new AudioContextClass();
        }

        return () => {
            // Clean up audio element
            if (audioElementRef.current) {
                audioElementRef.current.pause();
                audioElementRef.current.onplaying = null;
                audioElementRef.current.onended = null;
                audioElementRef.current.onerror = null;
                audioElementRef.current.onpause = null;
                audioElementRef.current.onloadeddata = null;
                audioElementRef.current.src = '';
            }

            // Clean up preload cache
            preloadCacheRef.current.forEach(audio => {
                audio.pause();
                audio.onplaying = null;
                audio.onended = null;
                audio.onerror = null;
                audio.onpause = null;
                audio.onloadeddata = null;
                audio.src = '';
            });
            preloadCacheRef.current.clear();

            // Clean up Web Audio API
            if (webAudioCtxRef.current) {
                webAudioCtxRef.current.close();
            }
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
                        // Clear all handlers before disposing
                        oldAudio.onplaying = null;
                        oldAudio.onended = null;
                        oldAudio.onerror = null;
                        oldAudio.onpause = null;
                        oldAudio.onloadeddata = null;
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

    // Track if we're currently playing to prevent overlapping calls
    const isPlayingRef = useRef(false);

    // Main play audio function (uses ref for muted state to keep callback stable)
    const playAudio = useCallback(async (infinitive: string, pronoun: string): Promise<void> => {
        const key = `${infinitive}_${pronoun}`;
        console.log(`[Audio] playAudio called: ${key}, isMuted: ${isMutedRef.current}, isPlaying: ${isPlayingRef.current}`);

        if (isMutedRef.current) {
            console.log('[Audio] BLOCKED - muted');
            return;
        }

        // Prevent overlapping play calls
        if (isPlayingRef.current) {
            console.log('[Audio] BLOCKED - already playing');
            return;
        }

        const audioPath = getAudioPath(infinitive, pronoun);

        try {
            // Check if audio is preloaded
            const preloadedAudio = preloadCacheRef.current.get(key);
            const audioToPlay = preloadedAudio || audioElementRef.current;
            console.log(`[Audio] Using ${preloadedAudio ? 'PRELOADED' : 'MAIN'} element`);

            if (!audioToPlay) {
                console.error('[Audio] Audio element not initialized');
                return;
            }

            // Stop any currently playing audio first
            audioToPlay.pause();
            audioToPlay.currentTime = 0;

            // Clear ALL existing handlers to prevent stacking/interference
            audioToPlay.onplaying = null;
            audioToPlay.onended = null;
            audioToPlay.onerror = null;
            audioToPlay.onpause = null;
            audioToPlay.onloadeddata = null;

            // Ensure audio doesn't loop
            audioToPlay.loop = false;

            // Set source if using main audio element
            if (!preloadedAudio && audioElementRef.current) {
                audioElementRef.current.src = audioPath;
            }

            // Set up fresh event handlers
            audioToPlay.onplaying = () => {
                console.log('[Audio] EVENT: onplaying');
                isPlayingRef.current = true;
                setIsPlaying(true);
            };

            audioToPlay.onended = () => {
                console.log('[Audio] EVENT: onended');
                isPlayingRef.current = false;
                setIsPlaying(false);
            };

            audioToPlay.onerror = () => {
                console.log('[Audio] EVENT: onerror');
                isPlayingRef.current = false;
                setIsPlaying(false);
            };

            console.log('[Audio] Calling play()...');
            await audioToPlay.play();
            console.log('[Audio] play() resolved');
        } catch (error) {
            console.error('[Audio] Error:', error);
            isPlayingRef.current = false;
            setIsPlaying(false);
        }
    }, [getAudioPath]);

    // Synthesized sound effects using Web Audio API (uses ref for muted state to keep callback stable)
    const playSoundEffect = useCallback((type: SoundEffectType) => {
        if (isMutedRef.current) return;

        const audioCtx = webAudioCtxRef.current;
        if (!audioCtx) return;

        // Resume audio context if suspended (browser autoplay policy)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const now = audioCtx.currentTime;

        if (type === 'hover') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'correct') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5 note
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
        } else if (type === 'wrong') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    }, []);

    const value = {
        isMuted,
        isPlaying,
        toggleMute,
        playAudio,
        stopAudio,
        preloadVerb,
        playSoundEffect
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
