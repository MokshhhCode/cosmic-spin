import Phaser from 'phaser';

export const PowerUpType = {
    TRIPLE_SHOT: 'triple_shot',
    LASER: 'laser',
    SHIELD: 'shield',
    SPEED: 'speed'
};

export default class PowerUp extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, type) {
        // For prototype, use different colors for types
        let texture = 'powerup'; // Placeholder
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.type = type;

        // Visual distinction
        switch (type) {
            case PowerUpType.TRIPLE_SHOT: this.setTint(0xffff00); break; // Yellow
            case PowerUpType.LASER: this.setTint(0xff0000); break; // Red
            case PowerUpType.SHIELD: this.setTint(0x00ffff); break; // Cyan
            case PowerUpType.SPEED: this.setTint(0x00ff00); break; // Green
        }
    }
}
