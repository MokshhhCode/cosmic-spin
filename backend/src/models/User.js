const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true }, // Firebase UID
    email: { type: String, required: true },
    displayName: { type: String },
    photoURL: { type: String },
    stats: {
        wins: { type: Number, default: 0 },
        gamesPlayed: { type: Number, default: 0 },
        kills: { type: Number, default: 0 }
    },
    skins: { type: [String], default: ['default'] }, // Inventory
    equippedSkin: { type: String, default: 'default' }, // Current Look
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
