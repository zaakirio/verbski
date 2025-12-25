import { AudioProvider } from './contexts/AudioContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { TutorialProvider } from './contexts/TutorialContext';
import Game from './components/Game';
import { TutorialOverlay } from './components/TutorialOverlay';

function App() {
  return (
    <SettingsProvider>
      <TutorialProvider>
        <AudioProvider>
          <div className="App">
            <Game />
            <TutorialOverlay />
          </div>
        </AudioProvider>
      </TutorialProvider>
    </SettingsProvider>
  );
}

export default App;