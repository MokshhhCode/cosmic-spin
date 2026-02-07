import { useEffect, useState } from 'react';

// Virtual Key mapping
// Corner 0 (TL): P1
// Corner 1 (TR): P2
// Corner 2 (BL): P3
// Corner 3 (BR): P4

export default function TouchControls({ gameInstance, mode = 'offline' }) {
    // We will emit events to Phaser's InputManager directly or via global window events

    const handleTouch = (corner, type) => {
        if (!gameInstance.current) return;

        // Dispatch custom event that InputManager listens to
        // Type: 'start' or 'end'
        const event = new CustomEvent('virtual_input', {
            detail: {
                corner,
                type
            }
        });
        window.dispatchEvent(event);
    };

    if (mode === 'offline') {
        return (
            <div className="absolute inset-0 z-10 touch-none select-none pointer-events-none">
                {/* 4 Corners Grid */}
                <div className="w-full h-full grid grid-cols-2 grid-rows-2">
                    {/* TL */}
                    <div
                        className="pointer-events-auto active:bg-white/10 border-r border-b border-white/20 relative"
                        onTouchStart={() => handleTouch(0, 'start')}
                        onTouchEnd={() => handleTouch(0, 'end')}
                    >
                        <span className="absolute top-4 left-4 text-green-500 font-bold opacity-50">P1</span>
                    </div>
                    {/* TR */}
                    <div
                        className="pointer-events-auto active:bg-white/10 border-l border-b border-white/20 relative"
                        onTouchStart={() => handleTouch(1, 'start')}
                        onTouchEnd={() => handleTouch(1, 'end')}
                    >
                        <span className="absolute top-4 right-4 text-red-500 font-bold opacity-50">P2</span>
                    </div>
                    {/* BL */}
                    <div
                        className="pointer-events-auto active:bg-white/10 border-r border-t border-white/20 relative"
                        onTouchStart={() => handleTouch(2, 'start')}
                        onTouchEnd={() => handleTouch(2, 'end')}
                    >
                        <span className="absolute bottom-4 left-4 text-blue-500 font-bold opacity-50">P3</span>
                    </div>
                    {/* BR */}
                    <div
                        className="pointer-events-auto active:bg-white/10 border-l border-t border-white/20 relative"
                        onTouchStart={() => handleTouch(3, 'start')}
                        onTouchEnd={() => handleTouch(3, 'end')}
                    >
                        <span className="absolute bottom-4 right-4 text-yellow-500 font-bold opacity-50">P4</span>
                    </div>
                </div>
            </div>
        );
    } // End Offline

    // Online Mode (Single Player)
    // Left side rotates, Right side shoots? Or split screen?
    // "Astro Party" usually is 2 buttons: Left (Rotate), Right (Shoot)
    return (
        <div className="absolute inset-0 z-10 touch-none select-none pointer-events-none flex">
            {/* Rotate Button (Left Half) */}
            <div
                className="w-1/2 h-full pointer-events-auto active:bg-white/10 border-r border-white/20 flex items-center justify-center"
                onTouchStart={() => handleTouch('rotate', 'start')}
                onTouchEnd={() => handleTouch('rotate', 'end')}
            >
                <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center">
                    <span className="text-white/50 font-bold text-xl">TURN</span>
                </div>
            </div>

            {/* Fire Button (Right Half) */}
            <div
                className="w-1/2 h-full pointer-events-auto active:bg-white/10 border-l border-white/20 flex items-center justify-center"
                onTouchStart={() => handleTouch('fire', 'start')}
                onTouchEnd={() => handleTouch('fire', 'end')}
            >
                <div className="w-20 h-20 rounded-full border-4 border-red-500/50 bg-red-500/20 flex items-center justify-center">
                    <span className="text-red-300 font-bold text-xl">FIRE</span>
                </div>
            </div>
        </div>
    );
}
