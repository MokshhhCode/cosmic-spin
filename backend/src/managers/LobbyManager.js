const { v4: uuidv4 } = require('uuid');

class LobbyManager {
    constructor(io) {
        this.io = io;
        this.rooms = new Map(); // roomId -> Room Object
    }

    createRoom(hostSocket, settings = {}) {
        const roomId = uuidv4().substring(0, 6).toUpperCase();

        const room = {
            id: roomId,
            hostId: hostSocket.id,
            players: new Map(), // socketId -> Player Data
            settings: {
                isPublic: settings.isPublic || false,
                maxPlayers: 4,
                gameMode: 'survival'
            },
            status: 'waiting' // waiting, playing
        };

        this.rooms.set(roomId, room);
        this.joinRoom(hostSocket, roomId);

        return roomId;
    }

    joinRoom(socket, roomId) {
        const room = this.rooms.get(roomId);
        if (!room) return { error: "Room not found" };
        if (room.players.size >= room.settings.maxPlayers) return { error: "Room full" };
        if (room.status !== 'waiting') return { error: "Game already started" };

        room.players.set(socket.id, {
            id: socket.id,
            ready: false,
            name: "Player " + (room.players.size + 1)
        });

        socket.join(roomId);

        // Notify room
        this.io.to(roomId).emit('lobby_update', this.getRoomData(roomId));

        return { success: true, roomId };
    }

    leaveRoom(socket) {
        // Find room user is in
        for (const [roomId, room] of this.rooms) {
            if (room.players.has(socket.id)) {
                room.players.delete(socket.id);
                socket.leave(roomId);

                if (room.players.size === 0) {
                    this.rooms.delete(roomId);
                } else {
                    this.io.to(roomId).emit('lobby_update', this.getRoomData(roomId));
                }
                return;
            }
        }
    }

    getRoomData(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) return null;
        return {
            id: room.id,
            players: Array.from(room.players.values()),
            settings: room.settings
        };
    }

    getPublicRooms() {
        const publicRooms = [];
        for (const [id, room] of this.rooms) {
            if (room.settings.isPublic && room.status === 'waiting') {
                publicRooms.push({
                    id: room.id,
                    players: room.players.size,
                    max: room.settings.maxPlayers
                });
            }
        }
        return publicRooms;
    }
}

module.exports = LobbyManager;
