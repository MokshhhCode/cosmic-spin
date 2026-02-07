import { useState, useEffect } from 'react';

export default function Leaderboard({ onClose }) {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/api/scores')
            .then(res => res.json())
            .then(data => {
                setScores(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-purple-500/50 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(168,85,247,0.3)] relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    ✕
                </button>

                <h2 className="text-3xl font-black text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 uppercase tracking-widest">
                    Galactic Legends
                </h2>

                {loading ? (
                    <div className="text-center text-purple-400 py-10 animate-pulse">Scanning Database...</div>
                ) : (
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
                        {scores.length === 0 ? (
                            <div className="text-center text-gray-500">No records found. Be the first!</div>
                        ) : (
                            scores.map((entry, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-800/50 p-3 rounded border border-white/5 hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className={`font-bold font-mono w-6 text-center ${index < 3 ? 'text-yellow-400' : 'text-gray-500'}`}>
                                            {index + 1}
                                        </span>
                                        <span className="text-white font-semibold">{entry.username}</span>
                                    </div>
                                    <span className="font-mono text-purple-300">{entry.score.toLocaleString()}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
