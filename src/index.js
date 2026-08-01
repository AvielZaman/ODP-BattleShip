import Player from "./models/player.js";
import GameController from "./models/gameController.js";
import { createBoard, markCell, createShipTray } from "./DOM.js";
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
let currentOrientation = "Horizontal";
let draggedShip = null;

const orientationBtn = document.getElementById("orientation-btn");
orientationBtn.addEventListener("click", () =>{
    currentOrientation = (currentOrientation === "Horizontal") ? "Vertical" : "Horizontal";
    orientationBtn.textContent = currentOrientation;
    const ships = document.querySelectorAll(".ship-container");
    ships.forEach(ship => {
        if (currentOrientation === "Vertical")
            ship.style.flexDirection = "column";
        else
            ship.style.flexDirection = "row";
    });
});

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

function getOrientation(){
    return currentOrientation;
}

function getDraggedShip(){
    return draggedShip;
}

function setDraggedShip(dragged){
    draggedShip = dragged;
}

function onAllShipsPlaced() {
    computerBoard.classList.remove("disabled");
    pTurn.textContent = "Your turn! Attack the enemy!";
}

const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", () =>{
    location.reload();
});

createBoard(humanBoard, false, null, human.placeShip.bind(human), getDraggedShip, onAllShipsPlaced);
createBoard(computerBoard, true, attackCallback);
computerBoard.classList.add("disabled"); // locked until all ships are placed

const shipTray = document.querySelector(".ship-tray");
createShipTray(shipTray, [5, 4, 3, 3, 2], getOrientation, getDraggedShip, setDraggedShip);
computer.placeShipsRandomally([5, 4, 3, 3, 2]);
