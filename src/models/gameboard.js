import Ship from "./ship.js";

class Gameboard {
    constructor() {
        this.size = 10;
        this.board = Array.from({ length: this.size },
            () => Array(this.size).fill(null));
        this.ships = [];
        this.shipCells = new Map(); // ship -> [{row, col}, ...] all cells it occupies
        this.missedAttacks = new Set();
        this.hitAttacks = new Set();
    }

    getKeyOfCoords(row, col) {
        return `${row}, ${col}`;
    }

    #checkIfCanPlace(row, col, length, axisDir) {
        if (axisDir === "Horizontal") {
            if (col + length > this.size) return false;
            for (let i = 0; i < length; i++) {
                if (this.board[row][col + i] !== null) return false;
            }
        }

        if (axisDir === "Vertical") {
            if (row + length > this.size) return false;
            for (let i = 0; i < length; i++) {
                if (this.board[row + i][col] !== null) return false;
            }
        }

        return true;
    }

    placeShip(row, col, length, axisDir) {
        if (!this.#checkIfCanPlace(row, col, length, axisDir)) return false;

        const ship = new Ship(length);
        const cells = [];

        if (axisDir === "Horizontal") {
            for (let i = 0; i < length; i++) {
                this.board[row][col + i] = ship;
                cells.push({ row, col: col + i });
            }
        } else if (axisDir === "Vertical") {
            for (let i = 0; i < length; i++) {
                this.board[row + i][col] = ship;
                cells.push({ row: row + i, col });
            }
        }

        this.ships.push(ship);
        this.shipCells.set(ship, cells);

        return ship; // truthy on success, used as "placed" indicator by callers
    }

    receiveAttack(rowAttacked, colAttacked) {
        const keyOfCoordsAttacked = this.getKeyOfCoords(rowAttacked, colAttacked);

        if (this.hitAttacks.has(keyOfCoordsAttacked) || this.missedAttacks.has(keyOfCoordsAttacked))
            return { valid: false, hit: false, sunk: false, sunkCells: null };

        const cell = this.board[rowAttacked][colAttacked];

        if (cell) {
            cell.hit();
            this.hitAttacks.add(keyOfCoordsAttacked);
            const sunk = cell.isSunk();
            return {
                valid: true,
                hit: true,
                sunk,
                sunkCells: sunk ? this.shipCells.get(cell) : null
            };
        }
        else {
            this.missedAttacks.add(keyOfCoordsAttacked);
            return { valid: true, hit: false, sunk: false, sunkCells: null };
        }
    }

    isAllSunk() {
        return this.ships.every(ship => ship.isSunk());
    }
}

export default Gameboard;