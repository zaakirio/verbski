import React, { useMemo } from 'react';
import { Floater } from '../../types';

const CYRILLIC_CHARS = ['Б', 'Г', 'Д', 'Ж', 'З', 'Й', 'Л', 'П', 'Ф', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
const FLOATER_COUNT = 15;

export const FloatingLetters: React.FC = () => {
  const floaters = useMemo<Floater[]>(() => {
    return Array.from({ length: FLOATER_COUNT }, (_, i) => ({
      id: i,
      char: CYRILLIC_CHARS[Math.floor(Math.random() * CYRILLIC_CHARS.length)],
      left: `${Math.random() * 100}%`,
      fontSize: `${0.8 + Math.random() * 1.5}rem`,
      animationDuration: `${15 + Math.random() * 20}s`,
      animationDelay: `-${Math.random() * 20}s`,
    }));
  }, []);

  return (
    <div className="bg-floaters">
      {floaters.map(floater => (
        <div
          key={floater.id}
          className="floater"
          style={{
            left: floater.left,
            fontSize: floater.fontSize,
            animationDuration: floater.animationDuration,
            animationDelay: floater.animationDelay,
          }}
        >
          {floater.char}
        </div>
      ))}
    </div>
  );
};
