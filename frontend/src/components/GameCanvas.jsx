import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import config from '../game/phaserConfig';
import TouchControls from './TouchControls';
import HUD from './HUD';

export default function GameCanvas({ config: gameConfig }) {
    const gameInstance = useRef(null);

    useEffect(() => {
        // Initialize Phaser Key
        if (!gameInstance.current) {
            gameInstance.current = new Phaser.Game(config);
            if (gameConfig) {
                gameInstance.current.registry.set('gameConfig', gameConfig);
            }
        }

        return () => {
            // Cleanup
            if (gameInstance.current) {
                gameInstance.current.destroy(true);
                gameInstance.current = null;
            }
        };
    }, []);

    return (
        <div id="game-container" className="relative w-[800px] h-[600px] rounded-lg overflow-hidden border-2 border-primary-500 shadow-2xl">
            <div id="phaser-root" className="w-full h-full" />
            <HUD gameInstance={gameInstance} config={gameConfig} />
            <TouchControls gameInstance={gameInstance} mode={gameConfig?.mode || 'offline'} />
        </div>
    );
}
