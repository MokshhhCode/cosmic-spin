const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/sync
// Syncs Firebase user with MongoDB
router.post('/sync', async (req, res) => {
    try {
        const { uid, email, displayName, photoURL } = req.body;

        // Find or Create
        let user = await User.findOne({ uid });
        if (!user) {
            user = new User({ uid, email, displayName, photoURL });
        } else {
            // Update fields
            user.lastLogin = Date.now();
            user.email = email;
            user.displayName = displayName;
            user.photoURL = photoURL;
        }

        await user.save();
        res.json({ success: true, user });
    } catch (err) {
        console.error("Auth Sync Error", err);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
