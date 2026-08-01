import Gameboard from "./gameboard.js";

class Player {
    constructor(type = 'human') {
        this.type = type;
        this.gameboard = new Gameboard();
        this.attackedPositions = new Set();
        this.huntQueue = [];
        this.shipsInfo = []; // { ship, name, length } - only populated for ships placed via placeShipsRandomally
    }

    // ships: array of { length, name }
    placeShipsRandomally(ships) {
        ships.forEach(({ length, name }) => {
            let placedShip = false;
            while (!placedShip) {
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * 10);
                const direction = Math.round(Math.random());
                placedShip = this.gameboard.placeShip(row, col, length, direction === 0 ? "Horizontal" : "Vertical");
            }
            this.shipsInfo.push({ ship: placedShip, name, length });
        });
    }

    getFleetStatus() {
        return this.shipsInfo.map(({ ship, name, length }) => ({
            name,
            length,
            sunk: ship.isSunk()
        }));
    }

    #isOnBoard(row, col) {
        return row >= 0 && row < 10 && col >= 0 && col < 10;
    }

    getComputerMove() {
        while (this.huntQueue.length > 0) {
            const candidate = this.huntQueue.pop();
            const key = `${candidate.row},${candidate.col}`;
            if (this.#isOnBoard(candidate.row, candidate.col) && !this.attackedPositions.has(key)) {
                this.attackedPositions.add(key);
                return candidate;
            }
        }

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

    registerAttackResult(row, col, hit, sunk) {
        if (sunk) {
            this.huntQueue = [];
            return;
        }

        if (hit) {
            const neighbors = [
                { row: row - 1, col },
                { row: row + 1, col },
                { row, col: col - 1 },
                { row, col: col + 1 }
            ];
            neighbors.forEach(n => {
                const key = `${n.row},${n.col}`;
                if (this.#isOnBoard(n.row, n.col) && !this.attackedPositions.has(key)) {
                    this.huntQueue.push(n);
                }
            });
        }
    }

    placeShip(row, col, length, axisDir) {
        return this.gameboard.placeShip(row, col, length, axisDir);
    }
}

export default Player;