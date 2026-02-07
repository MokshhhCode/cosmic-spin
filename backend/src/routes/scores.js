const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const User = require('../models/User');

// GET Top 10 Scores
router.get('/', async (req, res) => {
    try {
        const scores = await Score.find().sort({ score: -1 }).limit(10);
        res.json(scores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST New Score
router.post('/', async (req, res) => {
    const { uid, username, score } = req.body;
    try {
        const newScore = new Score({ uid, username, score });
        await newScore.save();

        // Check for Skin Unlocks
        const user = await User.findOne({ uid });
        if (user) {
            let unlocked = [];

            // "Gold Legend": Score > 10000
            if (score > 10000 && !user.skins.includes('gold_legend')) {
                user.skins.push('gold_legend');
                unlocked.push('gold_legend');
            }

            // "Void Walker": 10 Games Played (checked on score submit for now)
            if (user.stats.gamesPlayed >= 10 && !user.skins.includes('void_walker')) {
                user.skins.push('void_walker');
                unlocked.push('void_walker');
            }

            if (unlocked.length > 0) await user.save();

            res.json({ success: true, unlocked });
        } else {
            res.json({ success: true, unlocked: [] });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
