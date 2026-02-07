import Phaser from 'phaser';

export default class Magnet extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'magnet');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setImmovable(true);

        this.radius = 200;
        this.force = 100; // Pull strength
    }

    update(time, delta) {
        // Apply force to all ships in range
        if (this.scene.ships) {
            this.scene.ships.getChildren().forEach(ship => {
                const dist = Phaser.Math.Distance.Between(this.x, this.y, ship.x, ship.y);
                if (dist < this.radius) {
                    // Pull towards center
                    const angle = Phaser.Math.Angle.Between(ship.x, ship.y, this.x, this.y);
                    const force = new Phaser.Math.Vector2();
                    force.setToPolar(angle, this.force * (delta / 1000));

                    ship.body.velocity.add(force);
                }
            });
        }
    }
}
