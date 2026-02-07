export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = {};
    }

    preload() {
        // In a real project, we would load actual files.
        // For this prototype, we will generation synth sounds or use placeholders if possible.
        // Since we don't have files, we can't really preload them.
        // However, we can create an AudioContext-based synth if we wanted, but that's complex.
        // Let's assume we have some assets or just log for now, 
        // OR we can use valid Base64 placeholders for tiny beeps if we really want sound.

        // Let's use a simple URL for a "blip" sound if available online, or just setup the structure.
        // We'll stick to structure + console logs for now to avoid CORS/missing file errors, 
        // but I will add code to load 'assets/sounds/shoot.mp3' etc so the user just needs to drop files in.

        this.scene.load.audio('shoot', '/assets/sounds/shoot.mp3');
        this.scene.load.audio('explode', '/assets/sounds/explode.mp3');
        this.scene.load.audio('collect', '/assets/sounds/collect.mp3');
        this.scene.load.audio('music', '/assets/sounds/music.mp3');
    }

    create() {
        // Check if files loaded successfully before adding
        if (this.scene.cache.audio.exists('shoot')) this.sounds.shoot = this.scene.sound.add('shoot', { volume: 0.5 });
        if (this.scene.cache.audio.exists('explode')) this.sounds.explode = this.scene.sound.add('explode', { volume: 0.8 });
        if (this.scene.cache.audio.exists('collect')) this.sounds.collect = this.scene.sound.add('collect', { volume: 0.6 });

        if (this.scene.cache.audio.exists('music')) {
            this.sounds.music = this.scene.sound.add('music', { volume: 0.3, loop: true });
            this.sounds.music.play();
        }
    }

    play(key) {
        if (this.sounds[key]) {
            this.sounds[key].play();
        } else {
            // Fallback or dry run
            // console.log(`[Audio] Playing ${key}`);
        }
    }
}
