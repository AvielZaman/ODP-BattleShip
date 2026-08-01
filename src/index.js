import Player from "./models/player.js";
import GameController from "./models/gameController.js";
import { createBoard, markCell, markSunkShip, createShipTray } from "./DOM.js";
import "./styles.css";

// ============================
// DOM REFERENCES
// ============================
const humanBoard = document.querySelector(".human .board");
const computerBoard = document.querySelector(".enemy .board");
const pTurn = document.querySelector(".headers p");
const shipTray = document.querySelector(".ship-tray");
const orientationBtn = document.getElementById("orientation-btn");
const resetBtn = document.getElementById("reset-btn");

const popupOverlay = document.getElementById("popup-overlay");
const popupMessage = document.getElementById("popup-message");
const popupBtn = document.getElementById("popup-btn");

const toast = document.getElementById("toast");

const enemyFleetList = document.getElementById("enemy-fleet-list");

// ============================
// GAME STATE
// ============================
const human = new Player("human");
const computer = new Player("computer");
const game = new GameController(human, computer);

// classic Battleship fleet: length + name
const SHIPS = [
    { length: 5, name: "Carrier" },
    { length: 4, name: "Battleship" },
    { length: 3, name: "Cruiser" },
    { length: 3, name: "Submarine" },
    { length: 2, name: "Destroyer" }
];

let isGameOver = false;
let currentOrientation = "Horizontal";
let draggedShip = null;
let toastTimeout = null;

// ============================
// WIN / LOSE POPUP (blocking, requires acknowledgement)
// ============================
function showPopup(message, { showButton = false } = {}) {
    popupMessage.textContent = message;
    popupBtn.classList.toggle("hidden", !showButton);
    popupOverlay.classList.remove("hidden");
}

popupBtn.addEventListener("click", () => {
    location.reload();
});

// ============================
// TOAST (brief, non-blocking notification for hits/sinks)
// ============================
function showToast(message, ms = 1200) {
    toast.textContent = message;
    toast.classList.remove("hidden");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add("hidden");
    }, ms);
}

// ============================
// ENEMY FLEET TRACKER
// ============================
function renderEnemyFleet() {
    const fleetStatus = computer.getFleetStatus();
    enemyFleetList.innerHTML = "";

    fleetStatus.forEach(({ name, length, sunk }) => {
        const item = document.createElement("li");
        item.textContent = `${name} (${length})`;
        item.classList.toggle("fleet-sunk", sunk);
        enemyFleetList.appendChild(item);
    });
}

// ============================
// SHARED STATE ACCESSORS
// (passed into DOM.js functions so they can read/update this file's state)
// ============================
function getOrientation() {
    return currentOrientation;
}

function getDraggedShip() {
    return draggedShip;
}

function setDraggedShip(ship) {
    draggedShip = ship;
}

// ============================
// SHIP PLACEMENT PHASE
// ============================
function onAllShipsPlaced() {
    computerBoard.classList.remove("disabled");
    pTurn.textContent = "Your turn! Attack the enemy!";
}

orientationBtn.addEventListener("click", () => {
    currentOrientation = currentOrientation === "Horizontal" ? "Vertical" : "Horizontal";
    orientationBtn.textContent = currentOrientation;

    document.querySelectorAll(".ship-segments").forEach(segments => {
        segments.style.flexDirection = currentOrientation === "Vertical" ? "column" : "row";
    });
});

// ============================
// ATTACK PHASE
// ============================
function attackCallback(row, col) {
    if (isGameOver) {
        return { valid: false, hit: false, sunk: false, sunkCells: null, gameOver: true, row, col };
    }

    if (game.getCurrentPlayer() !== human) {
        return { valid: false, hit: false, sunk: false, sunkCells: null, gameOver: false, row, col };
    }

    const result = game.playTurn(row, col);

    if (result.valid) {
        renderEnemyFleet();
    }

    if (result.valid && result.gameOver) {
        handleGameOver(result.winner);
    } else if (result.valid && !result.gameOver) {
        if (result.sunk) {
            showToast("You sank a ship!");
        }
        pTurn.textContent = "Computer attacks!";

        computerBoard.classList.add("disabled");
        setTimeout(handleComputerTurn, 500);
    }

    return result;
}

function handleComputerTurn() {
    const computerResult = game.playComputerTurn();

    markCell(
        humanBoard,
        computerResult.row,
        computerResult.col,
        computerResult.hit
    );

    if (computerResult.sunk) {
        markSunkShip(humanBoard, computerResult.sunkCells);
        showToast("The computer sank one of your ships!");
    }

    if (computerResult.gameOver) {
        handleGameOver(computerResult.winner);
    } else {
        pTurn.textContent = "Your turn! Attack the enemy!";
        computerBoard.classList.remove("disabled");
    }
}

function handleGameOver(winner) {
    pTurn.textContent = `${winner.type} wins!`;
    computerBoard.classList.add("disabled");
    isGameOver = true;

    const message = winner.type === "human" ? "You win!" : "The computer wins!";
    showPopup(message, { showButton: true });
}

// ============================
// RESET
// ============================
resetBtn.addEventListener("click", () => {
    location.reload();
});

// ============================
// INITIAL SETUP
// ============================
createBoard(humanBoard, false, null, human.placeShip.bind(human), getDraggedShip, onAllShipsPlaced);
createBoard(computerBoard, true, attackCallback);
computerBoard.classList.add("disabled"); // locked until all ships are placed

createShipTray(shipTray, SHIPS, getOrientation, getDraggedShip, setDraggedShip);
computer.placeShipsRandomally(SHIPS);
renderEnemyFleet();