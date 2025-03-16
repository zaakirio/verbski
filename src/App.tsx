import { AudioProvider } from './contexts/AudioContext';
import Game from './components/Game';
import './services/ElevenLabsClient';
import './services/AudioCacheService';

function App() {
  return (
    <AudioProvider>
      <div className="App">
        <Game />
      </div>
    </AudioProvider>
  );
}
function checkApiConnectivity() {
  if (import.meta.env.PROD) {
    // Test ElevenLabs connectivity
    fetch('https://api.elevenlabs.io/v1/voices')
      .then(response => {
        document.body.setAttribute('data-elevenlabs-reachable', response.ok.toString());
      })
      .catch(error => {
        document.body.setAttribute('data-elevenlabs-error', error.toString());
      });
  }
}

// Call this early in your app initialization
checkApiConnectivity();
export default App;