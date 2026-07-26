import Ship from "./ship.js";

class Gameboard {
    constructor() {
        const size = 10;
        this.board = Array.from({ length: this.size },
            () => Array(this.size).fill(null));     // {ship: index of ship} for example: {submarine: 0}, {battleShip: 1}
        this.index = 0; // for the index of the ship
        this.ships = []; // {ship, coords}
        this.missedAttacks = new Set();
        this.hitAttacks = new Set();
    }

    getKeyOfCoords(row, col){
        return `${row}, ${col}`;
    }

    #checkIfCanPlace(row, col, length, axisDir) {
        // check if the ship is HORIZONTAL / VERTICAL and if out of bounds
        if (axisDir === "HORIZONTAL") {
            if (col + length >= this.size || col >= this.size)
                return false;
        }

        else if (axisDir === "VERTICAL") {
            if (row + length >= this.size || row >= this.size)
                return false;
        }

        // check if the cell is already taken HORIZONTAL or VERTICAL
        for (let i = row; i < length; i++) {
            if ((this.board[row][i] !== null) || (this.board[i][col] !== null))
                return false;
        }

        return true;
    }

    placeShip(row, col, length, axisDir) {
        if (!this.#checkIfCanPlace) return false;
        // can place, make new ship and push to ships- array of objects {ship:coords}
        const ship = new Ship(length);

        if (axisDir === HORIZONTAL) {
            for (let i = row; i < length; i++) 
                this.board[row][i] = this.index;
        }

        else if (axisDir === VERTICAL) {
            for (let i = col; i < length; i++) 
                this.board[i][col] = this.index;
        }

        this.ships.push({ ship: [row, col] });
        this.index++; // increment for next ship index
        
        return true;
    }

    receiveAttack(rowAttacked, colAttacked){
        const keyOfCoordsAttacked = this.getKeyOfCoords(rowAttacked,colAttacked);
        // check if the attack is alrady recorded as miss/hit
        if(this.hitAttacks.has(keyOfCoordsAttacked) || this.missedAttacks.has(keyOfCoordsAttacked))
            return false;

        const cell = this.board[rowAttacked, colAttacked];
        if(cell){    // if theres is a ship
            cell.ship.hit();
            this.hitAttacks.add(keyOfCoordsAttacked);
        }
        else
            this.missedAttacks.add(keyOfCoordsAttacked);

        return true;
    }

    isAllSunk(){
        return this.ships.every((ship) => ship.isSunk());
    }
}

export default Gameboard;