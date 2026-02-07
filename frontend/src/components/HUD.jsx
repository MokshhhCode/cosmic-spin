import { useState, useEffect } from 'react';

export default function HUD({ gameInstance, config }) {
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        setIsOnline(config?.mode === 'online');

        // Listen for game events if we set them up in Phaser registry
        const interval = setInterval(() => {
            if (gameInstance.current) {
                // Example: Sync data from Phaser registry
                // const reg = gameInstance.current.registry;
                // setScore(reg.get('score') || 0);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [config, gameInstance]);

    return (
        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between font-mono text-white select-none">
            {/* Top Bar */}
            <div className="flex justify-between items-start">
                {/* Lives / Status */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-red-500 font-bold text-xl">♥</span>
                        <span className="text-xl tracking-widest">{lives}</span>
                    </div>
                    {isOnline && (
                        <div className="bg-green-500/20 px-2 py-1 rounded text-xs text-green-300 border border-green-500/50">
                            ONLINE: {config.roomId}
                        </div>
                    )}
                </div>

                {/* Score */}
                <div className="text-right">
                    <div className="text-xs text-blue-300 opacity-70">SCORE</div>
                    <div className="text-3xl font-bold tracking-widest text-shadow-glow">
                        {score.toString().padStart(6, '0')}
                    </div>
                </div>
            </div>

            {/* Bottom Left - Controls Hint (Fade out?) */}
            <div className="opacity-50 text-[10px] md:text-xs">
                {isOnline ? 'Rotate: Left/Right Area | Shoot: Both' : 'P1: WASD | P2: Arrows | P3: IJKL | P4: Numpad'}
            </div>
        </div>
    );
}
