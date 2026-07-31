import Player from "./models/player.js";
import GameController from "./models/gameController.js";
import { createBoard, markCell } from "./DOM.js";
import "./styles.css";

const humanBoard = document.querySelector(".human .board");
const computerBoard = document.querySelector(".enemy .board");
const pTurn = document.querySelector(".headers p");

// create players
const human = new Player("human");
const computer = new Player("computer");

// create game
const game = new GameController(human, computer);

let isGameOver = false;

function attackCallback(row, col) {
    if (isGameOver) {
        return { valid: false, hit: false, gameOver: true, row, col };
    }
    if (game.getCurrentPlayer() !== human) {
        return { valid: false, hit: false, gameOver: false, row, col };
    }

    const result = game.playTurn(row, col);

    if (result.valid && result.gameOver) {
        pTurn.textContent = `${result.winner.type} wins!`;
        computerBoard.classList.add("disabled");
        isGameOver = true;
    } else if (result.valid && !result.gameOver) {
        pTurn.textContent = "Computer attacks!";
        computerBoard.classList.add("disabled");
        setTimeout(() => {
            const computerResult = game.playComputerTurn();
            markCell(humanBoard, computerResult.row, computerResult.col, computerResult.hit);

            if (computerResult.gameOver) {
                pTurn.textContent = `${computerResult.winner.type} wins!`;
                computerBoard.classList.add("disabled");
                isGameOver = true;
            }

            else {
                pTurn.textContent = "Your turn! Attack the enemy!";
                computerBoard.classList.remove("disabled");
            }
        }, 500);
    }

    return result;
}


createBoard(humanBoard);
createBoard(computerBoard, true, attackCallback);

// place ships (random for computer)
human.placeShip(5, 4, 2, "HORIZONTAL");
computer.placeShipsRandomally([5, 4, 3, 3, 2]);