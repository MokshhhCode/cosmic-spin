const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Friendship = require('../models/Friendship');

// GET /api/friends/:uid
// Get friend list
router.get('/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Find confirmed friendships
        const friendships = await Friendship.find({
            $or: [{ requester: user._id }, { recipient: user._id }],
            status: 2 // Accepted
        }).populate('requester recipient', 'uid displayName photoURL stats');

        const friends = friendships.map(f => {
            return f.requester._id.equals(user._id) ? f.recipient : f.requester;
        });

        res.json(friends);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/friends/request
// Send Friend Request
router.post('/request', async (req, res) => {
    try {
        const { requesterUid, recipientEmail } = req.body;

        const requester = await User.findOne({ uid: requesterUid });
        const recipient = await User.findOne({ email: recipientEmail });

        if (!requester || !recipient) return res.status(404).json({ error: "User not found" });
        if (requester.uid === recipient.uid) return res.status(400).json({ error: "Cannot Add Self" });

        // Check existing
        const existing = await Friendship.findOne({
            $or: [
                { requester: requester._id, recipient: recipient._id },
                { requester: recipient._id, recipient: requester._id }
            ]
        });

        if (existing) return res.status(400).json({ error: "Friendship already exists or pending" });

        const friendship = new Friendship({
            requester: requester._id,
            recipient: recipient._id,
            status: 0 // Pending
        });

        await friendship.save();
        res.json({ success: true, message: "Request Sent" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/friends/accept
router.post('/accept', async (req, res) => {
    try {
        const { friendshipId } = req.body;
        const friendship = await Friendship.findById(friendshipId);
        if (!friendship) return res.status(404).json({ error: "Request not found" });

        friendship.status = 2; // Accepted
        await friendship.save();

        res.json({ success: true, message: "Friend Added" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
