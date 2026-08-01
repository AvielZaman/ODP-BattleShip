class GameController {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = player1;
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    getOpponent() {
        return this.currentPlayer === this.player1
            ? this.player2
            : this.player1;
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
        const attacker = this.currentPlayer;
        const result = opponent.gameboard.receiveAttack(row, col);

        if (!result.valid) {
            return { valid: false, hit: false, sunk: false, sunkCells: null, gameOver: false, row, col };
        }

        const gameOver = opponent.gameboard.isAllSunk();

        const turnResult = {
            valid: true,
            hit: result.hit,
            sunk: result.sunk,
            sunkCells: result.sunkCells,
            row,
            col,
            gameOver,
            winner: gameOver ? attacker : null
        };

        if (!gameOver) this.switchTurn();

        return turnResult;
    }

    playComputerTurn() {
        if (this.currentPlayer.type !== "computer") {
            return null;
        }

        const computerPlayer = this.currentPlayer;
        const move = computerPlayer.getComputerMove();
        const result = this.playTurn(move.row, move.col);

        computerPlayer.registerAttackResult(move.row, move.col, result.hit, result.sunk);

        return result;
    }
}

export default GameController;