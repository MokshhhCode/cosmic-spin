import { useState, useEffect } from 'react';
import { networkManager } from '../game/managers/NetworkManager';
import Leaderboard from './Leaderboard';
import SkinSelector from './SkinSelector';

export default function Lobby({ onJoinGame }) {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('lobby'); // lobby, leaderboard, skins

    useEffect(() => {
        // Connect to socket
        networkManager.connect();
        refreshRooms();

        // Auto-refresh every 5s
        const interval = setInterval(refreshRooms, 5000);
        return () => clearInterval(interval);
    }, []);

    const refreshRooms = async () => {
        const list = await networkManager.getPublicRooms();
        setRooms(list);
    };

    const createRoom = async (isPublic) => {
        setLoading(true);
        const { success, roomId } = await networkManager.createRoom(isPublic);
        setLoading(false);
        if (success) {
            onJoinGame(roomId, true); // true = isHost
        }
    };

    const joinRoom = async (roomId) => {
        setLoading(true);
        const { success, error } = await networkManager.joinRoom(roomId);
        setLoading(false);
        if (success) {
            onJoinGame(roomId, false);
        } else {
            alert("Failed to join: " + error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[url('/assets/space-bg.jpg')] bg-cover bg-center z-40 text-white font-sans">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

            <div className="relative bg-gray-900/90 p-8 rounded-2xl max-w-2xl w-full border border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.4)]">
                <h1 className="text-6xl font-black text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg tracking-wider">
                    COSMIC SPIN
                </h1>

                <div className="grid grid-cols-2 gap-8">
                    {/* Create Section */}
                    <div className="space-y-4">
                        <div className="text-xl font-bold uppercase tracking-widest text-purple-300 border-b border-purple-500/30 pb-2 mb-4">Launch Pad</div>

                        <button
                            onClick={() => createRoom(true)}
                            className="group w-full py-4 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 rounded-xl font-bold transition-all transform hover:scale-105 border border-white/10 shadow-lg relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-lg">CREATE PUBLIC MATCH</span>
                            <span className="block text-xs font-normal opacity-60 mt-1 text-purple-200">Battle random opponents</span>
                        </button>

                        <button
                            onClick={() => createRoom(false)}
                            className="group w-full py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-all transform hover:scale-105 border border-white/10 shadow-lg"
                        >
                            <span className="text-lg">PRIVATE LOBBY</span>
                            <span className="block text-xs font-normal opacity-60 mt-1">Invite-only session</span>
                        </button>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setView('skins')}
                                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold border border-gray-600 text-sm uppercase tracking-wide"
                            >
                                🎨 Hangar
                            </button>
                            <button
                                onClick={() => setView('leaderboard')}
                                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold border border-gray-600 text-sm uppercase tracking-wide"
                            >
                                🏆 Legends
                            </button>
                        </div>

                        <button
                            onClick={() => onJoinGame('offline', true)}
                            className="group w-full py-4 bg-emerald-800 hover:bg-emerald-700 rounded-xl font-bold transition-all transform hover:scale-105 border border-white/10 shadow-lg mt-6"
                        >
                            <span className="text-lg text-emerald-100">LOCAL CHAOS</span>
                            <span className="block text-xs font-normal opacity-60 mt-1 text-emerald-300">4 Players • 1 Screen</span>
                        </button>
                    </div>

                    {/* Join Section */}
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4 border-b border-blue-500/30 pb-2">
                            <div className="text-xl font-bold uppercase tracking-widest text-blue-300">Sector Scan</div>
                            <button onClick={refreshRooms} className="text-xs uppercase font-bold text-blue-400 hover:text-blue-200 hover:underline tracking-wide">Refresh Radar</button>
                        </div>

                        <div className="bg-black/50 rounded-xl flex-grow overflow-y-auto p-3 space-y-2 mb-4 border border-white/5 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
                            {rooms.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
                                    <span className="text-4xl mb-2">📡</span>
                                    <p>No signals detected...</p>
                                </div>
                            ) : (
                                rooms.map(room => (
                                    <div key={room.id} className="flex justify-between items-center bg-gray-800/80 p-3 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors group">
                                        <div>
                                            <span className="font-mono text-blue-400 font-bold">#{room.id}</span>
                                            <span className="ml-3 text-xs text-gray-400 uppercase tracking-wide">{room.players}/{room.max} PILOTS</span>
                                        </div>
                                        <button
                                            onClick={() => joinRoom(room.id)}
                                            className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-500 text-xs font-bold uppercase shadow-lg transform group-hover:scale-105 transition-all"
                                        >
                                            Engage
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="ENTER ACCESS CODE..."
                                className="w-full bg-black/60 border border-gray-600 rounded-lg px-4 py-3 text-white text-center font-mono placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all uppercase tracking-widest"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') joinRoom(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {view === 'leaderboard' && <Leaderboard onClose={() => setView('lobby')} />}
            {view === 'skins' && <SkinSelector onClose={() => setView('lobby')} />}
        </div>
    );
}
