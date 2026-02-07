const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: Number,
        enums: [
            0,    // Add Friend (Request Sent)
            1,    // Requested (Received) - not typically stored explicitly if we check requester
            2,    // Friends (Accepted)
            3     // Blocked
        ]
    }
}, { timestamps: true });

module.exports = mongoose.model('Friendship', FriendshipSchema);
