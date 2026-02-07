const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    uid: { type: String, required: true }, // Link by Firebase UID
    username: { type: String, required: true }, // Snapshot of name at time of score
    score: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Index for fast leaderboard retrieval
ScoreSchema.index({ score: -1 });

module.exports = mongoose.model('Score', ScoreSchema);
