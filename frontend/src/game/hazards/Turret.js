import Phaser from 'phaser';

export default class Turret extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'turret'); // Needs texture

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(true);

        // Properties
        this.fireRate = 1000;
        this.lastFired = 0;
        this.rotationSpeed = 1; // deg per frame
    }

    update(time, delta) {
        this.angle += this.rotationSpeed;

        if (time > this.lastFired + this.fireRate) {
            this.fire();
            this.lastFired = time;
        }
    }

    fire() {
        // Spawn bullet from turret
        if (this.scene.bullets) {
            const bullet = this.scene.bullets.get();
            if (bullet) {
                bullet.fire(this.x, this.y, this.rotation);
                // Make turret bullets distinct? For now same.
            }
        }
    }
}
