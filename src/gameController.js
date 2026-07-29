class GameController {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = player1;
    }

    getOpponent() {
        return this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }

    switchTurn() {
        if (this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }
    }
    playTurn(row, col) {
        const opponent = this.getOpponent();
        const attackSucceeded = opponent.gameboard.receiveAttack(row, col);
        if (!attackSucceeded) return { valid: false, gameOver: false };

        if (opponent.gameboard.isAllSunk()) return { valid: true, gameOver: true };
        this.switchTurn();
        return {
            valid: true,
            gameOver: false
        };
    }
}