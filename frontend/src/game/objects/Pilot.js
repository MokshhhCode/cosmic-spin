import Phaser from 'phaser';

export default class Pilot extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture, controls) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.controls = controls;

        this.setDamping(true);
        this.setDrag(0.8); // High drag for pilot - stops quickly
        this.setMaxVelocity(100); // Slow movement
        this.setCircle(5);

        this.ROTATION_SPEED = 200;
        this.MOVE_SPEED = 50; // Very slow acceleration
    }

    update(time, delta) {
        // Controls - slightly different than ship?
        // "Pilot can still move (very slowly)"
        // Let's reuse Rotate + Forward (Move) logic but much slower.

        if (this.controls.rotateKey.isDown) {
            this.setAngularVelocity(this.ROTATION_SPEED);
        } else {
            this.setAngularVelocity(0);
        }

        // Pilot moves forward only when "Rotated"? Or maybe Fire button moves forward?
        // "Left button: Rotates... Right button: Fires" -> for ship.
        // For Pilot: Usually same buttons. 
        // Maybe Left = Rotate, Right = Move Forward? 
        // Or Left = Rotate, Right = Punch?
        // User said: "left button Rotates... right button Fires... Pilot can still move... can actually punch".
        // Let's assume:
        // LB: Rotate
        // RB: Move Forward (Kick/Punch Dash)

        if (this.controls.fireKey.isDown) {
            // Move forward slightly
            this.scene.physics.velocityFromRotation(this.rotation - Math.PI / 2, this.MOVE_SPEED, this.body.acceleration);
            // Maybe "Punch" animation or hitbox active?
        } else {
            this.setAcceleration(0);
        }
    }
}
