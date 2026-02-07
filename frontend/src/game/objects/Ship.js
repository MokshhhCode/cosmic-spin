import Phaser from 'phaser';

export default class Ship extends Phaser.Physics.Arcade.Image {
    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {string} texture 
     * @param {object} controls { rotateKey, fireKey }
     */
    constructor(scene, x, y, texture, controls) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.controls = controls;

        // PowerUp State
        this.powerups = {};

        // Physics constants
        this.setDamping(true);
        this.setDrag(0.2); // Small drag to eventual stop if not powered (though rule says auto-forward? Checking...)
        // RULE CHECK: "ship moves forwards by default". 
        // Implementation: In update loop, always apply velocity in Forward vector.

        this.setMaxVelocity(400);
        this.setCircle(10); // Hitbox

        // Game Rules Constants
        this.ROTATION_SPEED = 250; // Degrees per second
        this.FORWARD_SPEED = 150; // Constant forward speed
        this.RECOIL_FORCE = 300; // Force applied backwards when shooting
        this.FIRE_RATE = 250; // ms between shots

        this.lastFired = 0;
    }

    update(time, delta) {
        // 1. Constant Forward Movement
        const forwardVec = new Phaser.Math.Vector2();
        forwardVec.setToPolar(this.rotation - Math.PI / 2, 20);

        // Apply Speed Boost if active
        let outputAcceleration = 200;
        if (this.powerups.speed) {
            outputAcceleration = 350;
        }

        this.scene.physics.velocityFromRotation(this.rotation - Math.PI / 2, outputAcceleration, this.body.acceleration);

        // 2. Controls
        const rotatePressed = this.controls.rotateKey.isDown || (this.controls.virtual && this.controls.virtual.rotate);

        if (rotatePressed) {
            this.setAngularVelocity(this.ROTATION_SPEED);
        } else {
            this.setAngularVelocity(0);
        }

        const firePressed = this.controls.fireKey.isDown || (this.controls.virtual && this.controls.virtual.fire);

        if (firePressed && time > this.lastFired + this.FIRE_RATE) {
            this.fire(time);
        }
    }

    fire(time) {
        this.lastFired = time;

        // Recoil
        const recoilVec = new Phaser.Math.Vector2();
        recoilVec.setToPolar(this.rotation + Math.PI / 2, this.RECOIL_FORCE);
        this.body.velocity.add(recoilVec);

        // Spawn Bullet
        if (this.scene.bullets) {
            if (this.powerups.triple_shot) {
                // Triple Shot
                [-0.2, 0, 0.2].forEach(offset => {
                    const bullet = this.scene.bullets.get();
                    if (bullet) bullet.fire(this.x, this.y, this.rotation + offset);
                });
            } else if (this.powerups.laser) {
                // Laser (Big Bullet)
                const bullet = this.scene.bullets.get();
                if (bullet) {
                    bullet.fire(this.x, this.y, this.rotation);
                    bullet.setScale(2);
                }
                this.powerups.laserCount--;
                if (this.powerups.laserCount <= 0) this.powerups.laser = false;
            } else {
                // Normal
                const bullet = this.scene.bullets.get();
                if (bullet) {
                    bullet.fire(this.x, this.y, this.rotation);
                }
            }
        }

        if (this.scene.audioManager) {
            this.scene.audioManager.play('shoot');
        }
    }

    collectPowerUp(type) {
        this.powerups = { speed: false, triple_shot: false, laser: false, shield: false };

        switch (type) {
            case 'triple_shot': this.powerups.triple_shot = true; break;
            case 'laser':
                this.powerups.laser = true;
                this.powerups.laserCount = 3;
                break;
            case 'shield': this.powerups.shield = true; break;
            case 'speed': this.powerups.speed = true; break;
        }
        console.log("Collected", type);
    }
}
