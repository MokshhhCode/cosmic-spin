import io from 'socket.io-client';

class NetworkManager {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect(url = 'http://localhost:3000') {
        if (this.socket) return;

        this.socket = io(url);

        this.socket.on('connect', () => {
            console.log('Connected to server:', this.socket.id);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected');
        });

        // Universal Listener Dispatcher
        this.socket.onAny((event, ...args) => {
            if (this.listeners.has(event)) {
                this.listeners.get(event).forEach(cb => cb(...args));
            }
        });
    }

    // Lobby Methods
    createRoom(isPublic = false) {
        return new Promise((resolve) => {
            this.socket.emit('create_room', { isPublic }, (response) => {
                resolve(response);
            });
        });
    }

    joinRoom(roomId) {
        return new Promise((resolve) => {
            this.socket.emit('join_room', roomId, (response) => {
                resolve(response);
            });
        });
    }

    leaveRoom() {
        this.socket.emit('leave_room');
    }

    getPublicRooms() {
        return new Promise((resolve) => {
            this.socket.emit('get_public_rooms', (response) => {
                resolve(response);
            });
        });
    }

    sendPlayerUpdate(data) {
        if (this.socket) {
            this.socket.emit('player_update', data);
        }
    }

    // Event Helper
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (!this.listeners.has(event)) return;
        const filtered = this.listeners.get(event).filter(cb => cb !== callback);
        this.listeners.set(event, filtered);
    }
}

export const networkManager = new NetworkManager();
