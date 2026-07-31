import GameController from "./models/gameController.js";
function createBoard(boardElement, isEnemy = false, attackCallback) {
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        // save cell's index
        cell.dataset.index = i;

        // add "click" to enemy's cells
        if (isEnemy) {
            cell.addEventListener("click", () => {
                const row = Math.floor(i / 10);
                const col = Math.floor(i % 10);
                const { valid, gameOver, winner, hit } = attackCallback(row, col);
                if (valid)
                    markCell(boardElement, row, col, hit);
            })
        }
        boardElement.appendChild(cell);
    }
}

function markCell(boardElement, row, col, hit){
    const index = row * 10 + col;
    const cell = boardElement.querySelector(`[data-index="${index}"]`);
    cell.classList.add(hit ? "hit" : "miss");
}

export { createBoard, markCell };