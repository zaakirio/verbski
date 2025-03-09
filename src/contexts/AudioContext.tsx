import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface AudioContextType {
    isMuted: boolean;
    isPlaying: boolean;
    toggleMute: () => void;
    playAudio: (text: string) => void;
    stopAudio: () => void;
}

export const AudioContext = createContext<AudioContextType>({
    isMuted: false,
    isPlaying: false,
    toggleMute: () => { },
    playAudio: () => { },
    stopAudio: () => { }
});

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState<boolean>(() =>
        localStorage.getItem('verbski-audio-muted') === 'true'
    );
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const isSpeechAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;

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
        };
    }, [isSpeechAvailable]);

    useEffect(() => {
        if (!isPlaying || !isSpeechAvailable) return;

        const interval = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
                setIsPlaying(false);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isPlaying, isSpeechAvailable]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => {
            const newState = !prev;
            localStorage.setItem('verbski-audio-muted', newState.toString());

            if (newState && isSpeechAvailable) {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
            }

            return newState;
        });
    }, [isSpeechAvailable]);

    const playAudio = useCallback((text: string) => {
        if (isMuted || !isSpeechAvailable) {
            return;
        }

        if (isSpeechAvailable) {
            window.speechSynthesis.cancel();
        }

        try {
            const newUtterance = new SpeechSynthesisUtterance(text);

            newUtterance.lang = 'ru-RU';
            newUtterance.rate = 0.5; // Slow rate for Russian
            newUtterance.pitch = 1;
            newUtterance.volume = 1;

            // Event handlers
            newUtterance.onstart = () => {
                console.log('Speech started:', text);
                setIsPlaying(true);
            };

            newUtterance.onend = () => {
                console.log('Speech ended:', text);
                setIsPlaying(false);
            };

            newUtterance.onerror = (event) => {
                console.error('Speech error:', event);
                setIsPlaying(false);
            };

            window.speechSynthesis.speak(newUtterance);
        } catch (error) {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
        }
    }, [isMuted, isSpeechAvailable]);

    // Stop audio function
    const stopAudio = useCallback(() => {
        if (isSpeechAvailable) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        }
    }, [isSpeechAvailable]);

    const value = {
        isMuted,
        isPlaying,
        toggleMute,
        playAudio,
        stopAudio
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
