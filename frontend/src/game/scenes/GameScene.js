import Phaser from 'phaser';
import Ship from '../objects/Ship';
import Bullet from '../objects/Bullet';
import Pilot from '../objects/Pilot';
import InputManager from '../managers/InputManager';
import PowerUp from '../objects/PowerUp';
import Turret from '../hazards/Turret';
import Magnet from '../hazards/Magnet';
import AudioManager from '../managers/AudioManager';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.audioManager = new AudioManager(this);
        this.audioManager.preload();

        // Placeholder graphics for now - will replace with generated assets later
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Ship texture (triangle)
        graphics.fillStyle(0x00ff00, 1); // Green ship
        graphics.beginPath();
        graphics.moveTo(0, -15);
        graphics.lineTo(10, 10);
        graphics.lineTo(-10, 10);
        graphics.closePath();
        graphics.fillPath();
        graphics.generateTexture('ship', 20, 30);

        // Bullet texture (circle)
        graphics.clear();
        graphics.fillStyle(0xffff00, 1);
        graphics.fillCircle(5, 5, 5);
        graphics.generateTexture('bullet', 10, 10);
    }

    create() {
        this.audioManager.create();

        // Read Config
        const gameConfig = this.registry.get('gameConfig');
        const isOnline = gameConfig && gameConfig.mode === 'online';

        const { width, height } = this.scale;

        // Groups
        this.ships = this.physics.add.group({
            classType: Ship,
            runChildUpdate: true,
            collideWorldBounds: true,
            bounceX: 1,
            bounceY: 1
        });

        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 100,
            runChildUpdate: true
        });

        // Initialize Input Manager
        this.inputManager = new InputManager(this);

        // Online State
        this.otherPlayers = new Map(); // id -> Ship

        // Spawn Logic
        if (!isOnline) {
            // OFFLINE: Spawn 4 Local Players
            const positions = [
                { x: 100, y: 100, color: 0x00ff00 }, // P1: Green (TL)
                { x: width - 100, y: 100, color: 0xff0000 }, // P2: Red (TR)
                { x: 100, y: height - 100, color: 0x0000ff }, // P3: Blue (BL)
                { x: width - 100, y: height - 100, color: 0xffff00 } // P4: Yellow (BR)
            ];

            positions.forEach((pos, index) => {
                const controls = this.inputManager.getControls(index);
                if (controls) {
                    const ship = new Ship(this, pos.x, pos.y, 'ship', controls);
                    ship.setTint(pos.color);
                    ship.setCollideWorldBounds(true);
                    ship.setBounce(1);
                    this.ships.add(ship);
                }
            });
        } else {
            // ONLINE: Spawn Self + Listen for others
            console.log("Online Mode:", gameConfig.roomId);

            this.roomId = gameConfig.roomId;
            const ship = new Ship(this, 100, 100, 'ship', this.inputManager.getControls(0));

            // Apply Skin
            const skinColors = {
                'default': 0x00ff00,
                'red_ace': 0xff0000,
                'gold_legend': 0xffd700,
                'void_walker': 0x800080
            };
            const skinColor = skinColors[gameConfig.skin] || 0x00ff00;
            ship.setTint(skinColor);

            ship.setCollideWorldBounds(true);
            ship.setBounce(1);
            this.ships.add(ship);
            this.myShip = ship;

            // Connect Network Manager
            import('../managers/NetworkManager').then(({ networkManager }) => {
                this.networkManager = networkManager;
                networkManager.on('player_update', (data) => this.handlePlayerUpdate(data));

                // TODO: Send skin info in initial handshake or player update so others see it
            });
        }

        this.physics.world.setBounds(0, 0, width, height);

        // Ship vs Ship (Bounce)
        this.physics.add.collider(this.ships, this.ships);

        // Bullet vs Ship
        this.physics.add.collider(this.bullets, this.ships, (bullet, ship) => {
            if (bullet.active && ship.active) {
                // Friendly fire check? (Maybe later)
                // For now, any bullet kills any ship
                this.createExplosion(ship.x, ship.y);
                bullet.disableBody(true, true);
                ship.kill();
            }
        });

        this.powerups = this.physics.add.group({
            classType: PowerUp,
            runChildUpdate: true
        });

        this.physics.add.overlap(this.ships, this.powerups, (ship, powerup) => {
            if (powerup.active && ship.active) {
                ship.collectPowerUp(powerup.type);
                powerup.destroy();
                this.audioManager.play('collect');
            }
        });


        // Hazards
        this.hazards = [];
        // Spawn 1 Turret at Center
        const turret = new Turret(this, width / 2, height / 2);
        this.hazards.push(turret);

        // Particles
        this.explosionParticles = this.add.particles(0, 0, 'bullet', {
            lifespan: 500,
            speed: { min: 50, max: 150 },
            scale: { start: 0.8, end: 0 },
            blendMode: 'ADD',
            emitting: false
        });
    }

    createExplosion(x, y) {
        this.explosionParticles.emitParticleAt(x, y, 20);
        this.audioManager.play('explode');
    }

    spawnPilot(x, y, controls) {
        const pilot = new Pilot(this, x, y, 'ship', controls); // Using 'ship' texture for now, maybe tinted?
        pilot.setTint(0xff0000); // Red pilot
    }

    update(time, delta) {
        // Wraparound Logic
        this.physics.world.wrap(this.ships, 10);
        this.physics.world.wrap(this.bullets, 10);
        this.physics.world.wrap(this.powerups, 10);

        // Update Hazards
        this.hazards.forEach(h => h.update(time, delta));

        // Online Sync
        if (this.myShip && this.myShip.active && this.networkManager) {
            this.networkManager.sendPlayerUpdate({
                roomId: this.roomId,
                x: this.myShip.x,
                y: this.myShip.y,
                rotation: this.myShip.rotation,
                vx: this.myShip.body.velocity.x,
                vy: this.myShip.body.velocity.y
            });
        }

        // Debug: press B to spawn Bot
        if (this.input.keyboard.checkDown(this.input.keyboard.addKey('B'), 500)) {
            this.spawnBot();
        }
    }

    spawnBot() {
        import('../objects/BotShip').then(({ default: BotShip }) => {
            const bot = new BotShip(this, 100, 100, 'ship');
            bot.setTint(0xff00ff); // Purple Bot
            bot.setCollideWorldBounds(true);
            bot.setBounce(1);
            this.ships.add(bot);
            console.log("Bot spawned");
        });
    }

    handlePlayerUpdate(data) {
        if (!this.otherPlayers) return;

        let ghost = this.otherPlayers.get(data.id);
        if (!ghost) {
            // Spawn new Ghost
            ghost = new Ship(this, data.x, data.y, 'ship', null);
            ghost.setTint(0xffffff);
            this.otherPlayers.set(data.id, ghost);
            this.ships.add(ghost);
        }

        ghost.setPosition(data.x, data.y);
        ghost.setRotation(data.rotation);
        if (data.vx !== undefined) ghost.body.setVelocity(data.vx, data.vy);
    }
}
