import Player from "./models/player.js";
import GameController from "./models/gameController.js";
import { createBoard, markCell } from "./DOM.js";
import "./styles.css";

const humanBoard = document.querySelector(".human .board");
const computerBoard = document.querySelector(".enemy .board");

// create players
const human = new Player("human");
const computer = new Player("computer");

// create game
const game = new GameController(human, computer);

function attackCallback(row, col) {
    if (game.getCurrentPlayer() !== human) {
        return { valid: false, hit: false, gameOver: false, row, col };
    }

    const result = game.playTurn(row, col);

    if (result.valid && result.gameOver) {
        console.log(`${result.winner.type} wins!`);
    } else if (result.valid && !result.gameOver) {
        setTimeout(() => {
            const computerResult = game.playComputerTurn();
            markCell(humanBoard, computerResult.row, computerResult.col, computerResult.hit);

            if (computerResult.gameOver) {
                console.log(`${computerResult.winner.type} wins!`);
            }
        }, 500);
    }

    return result;
}


createBoard(humanBoard);
createBoard(computerBoard, true, attackCallback);

// place ships (random for computer)
human.placeShip(5,4,2,"HORIZONTAL");
computer.placeShipsRandomally([5, 4, 3, 3, 2]);




// let turn = 1;
// let result;

// console.log("=== GAME START ===");

// while (true) {
//     console.log(`\n--- Turn ${turn} ---`);

//     const currentPlayer = game.getCurrentPlayer();
//     console.log("Current player:", currentPlayer.type);

//     result = game.playComputerTurn();

//     console.log("Move result:", result);

//     if (result.gameOver) {
//         console.log("\n=== GAME OVER ===");
//         console.log("Winner:", result.winner);
//         break;
//     }

//     turn++;
// }