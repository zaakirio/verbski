import { AudioProvider } from './contexts/AudioContext';
import { Auth0Provider } from '@auth0/auth0-react';
import Game from './components/Game';
import { Profile } from './components/Profile';
import { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'profile'>('game');

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
      }}
    >
      <AudioProvider>
        <div className="App">
          <nav className="bg-white shadow-md p-4">
            <div className="max-w-6xl mx-auto flex justify-center gap-4">
              <button
                onClick={() => setActiveTab('game')}
                className={`px-4 py-2 rounded ${
                  activeTab === 'game'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Game
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded ${
                  activeTab === 'profile'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Profile
              </button>
            </div>
          </nav>
          <main className="max-w-6xl mx-auto p-4">
            {activeTab === 'game' ? <Game /> : <Profile />}
          </main>
        </div>
      </AudioProvider>
    </Auth0Provider>
  );
}

export default App;