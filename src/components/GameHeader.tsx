import { memo } from 'react';

export const GameHeader = memo(() => {
  return (
    <header className="game-header">
      <h1>Verbski</h1>
      <p>A russian verb conjugation game</p>
    </header>
  );
});

