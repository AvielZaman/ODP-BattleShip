import Gameboard from "./gameboard.js";

class Player {
    constructor(type = 'human') {
        this.type = type;
        this.gameboard = new Gameboard();
        this.attackedPositions = new Set();
    }


    placeShipsRandomally(ships) {
        for (const length of ships) {
            let isPlaced = false;
            while (!isPlaced) {
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * 10);
                const direction = Math.round(Math.random()); // 50/50 chance of horizonal or Vertical
                isPlaced = this.gameboard.placeShip(row, col, length, direction === 0 ? "Horizontal" : "Vertical");
            }
        }
    }

    getComputerMove() {
        let randomRow;
        let randomCol;
        let coordsOfKey;
        do {
            randomRow = Math.floor(Math.random() * 10);
            randomCol = Math.floor(Math.random() * 10);
            coordsOfKey = `${randomRow},${randomCol}`;
        }
        while (this.attackedPositions.has(coordsOfKey))
        this.attackedPositions.add(coordsOfKey)
        return { row: randomRow, col: randomCol };

    }

    placeShip(row, col, length, axisDir) {
        return this.gameboard.placeShip(row, col, length, axisDir);
    }
}

export default Player;