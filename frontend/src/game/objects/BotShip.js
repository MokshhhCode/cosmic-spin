import Ship from '../objects/Ship';
import { Selector, Sequence, Action, Condition } from '../ai/BehaviorTree';

export default class BotShip extends Ship {
    constructor(scene, x, y, texture) {
        // Bots don't have direct input controls
        super(scene, x, y, texture, null);
        this.isBot = true;

        // AI State
        this.target = null;
        this.shootTimer = 0;

        // Tree
        this.brain = this.buildBehaviorTree();
    }

    buildBehaviorTree() {
        return new Selector([
            // Priority 1: Avoid Hazards
            new Sequence([
                new Condition(() => this.detectHazards()),
                new Action(() => this.avoidHazard())
            ]),

            // Priority 2: Attack Target
            new Sequence([
                new Condition(() => this.hasTarget()),
                new Sequence([
                    new Action(() => this.aimAtTarget()),
                    new Action(() => this.shootAtTarget())
                ])
            ]),

            // Priority 3: Find Target
            new Action(() => this.findNearestTarget())
        ]);
    }

    update(time, delta) {
        // Run AI Tick
        if (this.brain) {
            this.brain.tick({ bot: this, scene: this.scene, delta });
        }

        // Physics update (Ship.js handles velocityFromRotation)
        // We just need to simulate input by setting rotation/firing flags if needed
        // But Ship.js update relies on 'controls' object.
        // We override Ship update or modify it to accept AI commands.

        // For prototype: Direct Body manipulation based on AI output
        // Or Simulate Input
        super.update(time, delta);
    }

    // AI Actions
    detectHazards() {
        // Simple check: Is bullet too close?
        // For prototype: return false
        return false;
    }

    avoidHazard() {
        return 'success';
    }

    hasTarget() {
        if (this.target && !this.target.active) this.target = null;
        return this.target !== null;
    }

    findNearestTarget() {
        // Find closest ship that isn't me
        let closest = null;
        let minDist = Infinity;

        this.scene.ships.children.each(ship => {
            if (ship !== this && ship.active) {
                const dist = Phaser.Math.Distance.Between(this.x, this.y, ship.x, ship.y);
                if (dist < minDist) {
                    minDist = dist;
                    closest = ship;
                }
            }
        });

        this.target = closest;
        return closest ? 'success' : 'failure';
    }

    aimAtTarget() {
        if (!this.target) return 'failure';

        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        // Rotate towards angle
        // Ship rotates by constant speed.
        // Simple AI: Set rotation directly or steer

        // Steer
        const diff = Phaser.Math.Angle.Wrap(angle - this.rotation);

        if (Math.abs(diff) > 0.1) {
            if (diff > 0) this.rotation += 0.05;
            else this.rotation -= 0.05;
        }

        return 'success';
    }

    shootAtTarget() {
        if (!this.target) return 'failure';

        // Check alignment
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        const diff = Math.abs(Phaser.Math.Angle.Wrap(angle - this.rotation));

        if (diff < 0.2) {
            // Fire!
            // Call Ship.fire() directly?
            // Need to manage cooldown manually since Ship.fire might rely on key press
            // Actually Ship.fire(time) uses time for cooldown.
            this.fire(this.scene.time.now);
            return 'success';
        }
        return 'running';
    }
}
