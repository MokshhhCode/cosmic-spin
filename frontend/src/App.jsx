import { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Login from './components/Login';
import Lobby from './components/Lobby';

function GameCheck() {
  const { currentUser } = useAuth();
  const [gameState, setGameState] = useState('menu'); // menu, game
  const [gameConfig, setGameConfig] = useState(null); // { roomId, isHost, mode: 'online' | 'offline' }

  if (!currentUser) return <Login />;

  const handleJoinGame = (roomId, isHost) => {
    const mode = roomId === 'offline' ? 'offline' : 'online';
    // Mock equipping skin - in real app, read from user profile
    // For now, let's just use what was selected in SkinSelector or default
    // Since we don't have global state for skin yet, let's default to a random one for demo if not set?
    // Actually, SkinSelector has local state. We should probably hoist that state or read from Context.
    // For now, let's just pass a default. To make it work properly, we need to hoist equippedSkin.
    const equippedSkin = 'default';
    setGameConfig({ roomId, isHost, mode, skin: equippedSkin });
    setGameState('game');
  };

  if (gameState === 'game') {
    return (
      <>
        <GameCanvas config={gameConfig} />
        {/* Simple exit button for prototype */}
        <button
          onClick={() => setGameState('menu')}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-red-600 rounded text-white font-bold"
        >
          Exit Game
        </button>
      </>
    );
  }

  return <Lobby onJoinGame={handleJoinGame} />;
}

function App() {
  return (
    <AuthProvider>
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <GameCheck />
      </div>
    </AuthProvider>
  );
}

export default App;
