export default class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.virtualInputs = new Map(); // id -> { rotate: isDown, fire: isDown }

        // Listen for global events from React
        window.addEventListener('virtual_input', (e) => {
            const { corner, type } = e.detail;
            // Map corner to player controls
            // This is basic mapping, we need to know WHAT action (rotate/fire) or mapping logic.
            // For now, let's assume TouchControls sends distinct actions or we map corners.
            // Offline Mode: Corner = Player Index.
            // But how do we distinguish rotate vs fire?
            // "Two-button control scheme" usually means:
            // Tap Left side of corner -> Rotate
            // Tap Right side of corner -> Fire
            // Or simple tap = Rotate, Double tap = Fire? 
            // Original Astro Party: 
            // "Left button rotates, Right button fires"
            // So each corner needs 2 zones.

            // Let's rely on TouchControls passing detailed info later.
            // For now, assume TouchControls sends: { playerIndex, action: 'rotate'|'fire', isDown }

            if (e.detail.action) {
                this.handleVirtualInput(e.detail.playerIndex, e.detail.action, type === 'start');
            }
        });
    }

    handleVirtualInput(playerId, action, isDown) {
        if (!this.virtualInputs.has(playerId)) {
            this.virtualInputs.set(playerId, { rotate: false, fire: false });
        }
        const state = this.virtualInputs.get(playerId);
        state[action] = isDown;
    }

    getControls(playerId) {
        const cursors = this.scene.input.keyboard.createCursorKeys();
        const keys = this.scene.input.keyboard.addKeys({
            // P1
            p1_rotate: Phaser.Input.Keyboard.KeyCodes.A,
            p1_fire: Phaser.Input.Keyboard.KeyCodes.D,

            // P2 (Arrows - re-mapping for clarity if needed, or stick to createCursorKeys)
            // Actually createCursorKeys gives UP, DOWN, LEFT, RIGHT.
            // We want Left (Rotate), Right (Fire).

            // P3
            p3_rotate: Phaser.Input.Keyboard.KeyCodes.J,
            p3_fire: Phaser.Input.Keyboard.KeyCodes.L,

            // P4
            p4_rotate: Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR,
            p4_fire: Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX
        });

        switch (playerId) {
            case 0: // Player 1
                return {
                    rotateKey: keys.p1_rotate,
                    fireKey: keys.p1_fire,
                    // Add virtual check
                    virtual: this.virtualInputs.get(0)
                };
            case 1: // Player 2
                return {
                    rotateKey: cursors.left,
                    fireKey: cursors.right,
                    virtual: this.virtualInputs.get(1)
                };
            case 2: // Player 3
                return {
                    rotateKey: keys.p3_rotate,
                    fireKey: keys.p3_fire,
                    virtual: this.virtualInputs.get(2)
                };
            case 3: // Player 4
                return {
                    rotateKey: keys.p4_rotate,
                    fireKey: keys.p4_fire,
                    virtual: this.virtualInputs.get(3)
                };
            default:
                return null;
        }
    }
}
