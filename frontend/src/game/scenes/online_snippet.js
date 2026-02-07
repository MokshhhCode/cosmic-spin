
// ... inside GameScene class ...

// Add this to update()
if (this.isOnline && this.myShip && this.myShip.active) {
    // failed to persist variable, will fix in next step properly
}

// New helper method
handlePlayerUpdate(data) {
    if (data.id === this.socketId) return; // Should not happen if using socket.to

    let ghost = this.otherPlayers.get(data.id);
    if (!ghost) {
        // Spawn new Ghost
        ghost = new Ship(this, data.x, data.y, 'ship', null); // No controls
        ghost.setTint(0xffffff); // White for ghosts
        ghost.body.setAllowGravity(false); // If gravity exists
        this.otherPlayers.set(data.id, ghost);
        this.ships.add(ghost);
    }

    // Update Ghost
    ghost.setPosition(data.x, data.y);
    ghost.setRotation(data.rotation);
    // ghost.setVelocity(data.vx, data.vy); // Optional: interprolation
}
