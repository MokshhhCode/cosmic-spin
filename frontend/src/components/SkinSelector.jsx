import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

const SKINS = {
    'default': { name: 'Void Scout', color: '#00ff00', description: 'Standard issue.' },
    'red_ace': { name: 'Red Ace', color: '#ff0000', description: 'Awarded for your first victory.' },
    'gold_legend': { name: 'Gold Legend', color: '#ffd700', description: 'Score over 10,000 points.' },
    'void_walker': { name: 'Void Walker', color: '#800080', description: 'Play 10 Online Matches.' }
};

export default function SkinSelector({ onClose }) {
    const { currentUser } = useAuth();
    const [mySkins, setMySkins] = useState(['default']);
    const [equipped, setEquipped] = useState('default');

    useEffect(() => {
        // Fetch user data to get skins
        if (currentUser) {
            // In a real app, fetch from backend. For prototype, we mock or use what we have.
            // But we added 'skins' to User model, so let's try to fetch if we had an endpoint.
            // For now, let's just assume we have them locally or mock them for the UI demonstration
            // since we didn't make a specific GET /user/me endpoint that returns full profile yet.
            // We will mock it for now to demonstrate UI.
            setMySkins(['default', 'red_ace']); // Mock inventory
        }
    }, [currentUser]);

    const equipSkin = (skinId) => {
        setEquipped(skinId);
        // TODO: Call API to save equipped skin
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-blue-500/50 rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(59,130,246,0.3)] relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    ✕
                </button>

                <h2 className="text-3xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 uppercase tracking-widest">
                    Hangar Bay
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Preview */}
                    <div className="flex flex-col items-center justify-center bg-black/50 rounded-xl p-8 border border-white/10">
                        <div
                            className="w-32 h-32 mb-6 transition-all duration-500 shadow-[0_0_30px_currentColor]"
                            style={{
                                backgroundColor: SKINS[equipped]?.color || '#fff',
                                color: SKINS[equipped]?.color || '#fff',
                                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' // Triangle Ship
                            }}
                        ></div>
                        <h3 className="text-2xl font-bold text-white mb-2">{SKINS[equipped]?.name}</h3>
                        <p className="text-gray-400 text-sm text-center">{SKINS[equipped]?.description}</p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 gap-4 content-start">
                        {Object.entries(SKINS).map(([id, skin]) => {
                            const isUnlocked = mySkins.includes(id);
                            const isEquipped = equipped === id;

                            return (
                                <button
                                    key={id}
                                    onClick={() => isUnlocked && equipSkin(id)}
                                    disabled={!isUnlocked}
                                    className={`
                                        p-4 rounded-lg border flex flex-col items-center gap-2 transition-all
                                        ${isEquipped ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-gray-700 bg-gray-800'}
                                        ${!isUnlocked ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-gray-700 cursor-pointer'}
                                    `}
                                >
                                    <div
                                        className="w-8 h-8"
                                        style={{ backgroundColor: skin.color, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                                    ></div>
                                    <span className="text-xs font-bold uppercase">{skin.name}</span>
                                    {!isUnlocked && <span className="text-[10px] text-red-400">LOCKED</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded font-bold uppercase tracking-widest transition-all shadow-lg"
                    >
                        Confirm Loadout
                    </button>
                </div>
            </div>
        </div>
    );
}
