import { AudioProvider } from './contexts/AudioContext';
import Game from './components/Game';

function App() {
  return (
    <AudioProvider>
      <div className="App">
        <Game />
      </div>
    </AudioProvider>
  );
}

export default App;