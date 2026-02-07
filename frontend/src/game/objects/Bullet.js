import Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // Add to scene and physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = 800;
        this.lifespan = 1000; // ms (or can use distance)
        this.damage = 1;
    }

    fire(x, y, rotation) {
        this.enableBody(true, x, y, true, true);
        this.setActive(true);
        this.setVisible(true);

        this.setRotation(rotation);
        // Align velocity with rotation
        // Bullet usually travels forward relative to itself.
        // Assuming 0 rotation is pointing Right. 
        // And if texture is a circle, rotation doesn't matter visually, but matters for velocity.
        this.scene.physics.velocityFromRotation(rotation - Math.PI / 2, this.speed, this.body.velocity);

        // Set max lifespan
        this.lifespan = 1000;
    }

    update(time, delta) {
        this.lifespan -= delta;
        if (this.lifespan <= 0) {
            this.disableBody(true, true);
        }
    }
}
