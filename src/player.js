import Gameboard from "./gameboard.js";

class Player {
    constructor(type = 'human') {
        this.type = type;
        this.gameboard = new Gameboard();
    }


    placeShipsRandomally(ships) {
        for (const length of ships) {
            let isPlaced = false;
            while (!isPlaced) {
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * 10);
                const direction = Math.round(Math.random()); // 50/50 chance of horizonal or vertical
                isPlaced = this.gameboard.placeShip(row,col, length, direction === 0 ? "HORIZONTAL" : "VERTICAL");
            }
        }
    }
}

export default Player;