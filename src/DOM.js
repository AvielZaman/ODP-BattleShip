function createBoard(boardElement, isEnemy = false, attackCallback, placeShipCb, getDraggedShip = null, onAllShipsPlaced = null) {
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;

        if (isEnemy) {
            cell.addEventListener("click", () => {
                const row = Math.floor(i / 10);
                const col = Math.floor(i % 10);
                const { valid, gameOver, winner, hit, sunk, sunkCells } = attackCallback(row, col);
                if (valid) {
                    markCell(boardElement, row, col, hit);
                    if (sunk) markSunkShip(boardElement, sunkCells);
                }
            })
        }
        else {
            cell.addEventListener("dragover", (event) => {
                event.preventDefault();
            });

            cell.addEventListener("drop", (event) => {
                event.preventDefault();
                const dropRow = Math.floor(i / 10);
                const dropCol = Math.floor(i % 10);

                const data = JSON.parse(event.dataTransfer.getData("text/plain"));
                const length = data.length;
                const orientation = data.orientation;
                const grabOffset = data.grabOffset;

                let row, col;
                if (orientation === "Horizontal") {
                    row = dropRow;
                    col = dropCol - grabOffset;
                } else {
                    row = dropRow - grabOffset;
                    col = dropCol;
                }

                const placed = placeShipCb(row, col, length, orientation);

                if (placed) {
                    markShip(boardElement, row, col, length, orientation);
                    const draggedShip = getDraggedShip();
                    draggedShip.remove();

                    const remainingShips = document.querySelectorAll(".ship-container");
                    if (remainingShips.length === 0 && onAllShipsPlaced) {
                        onAllShipsPlaced();
                    }
                } else {
                    cell.classList.add("invalid-drop");
                    setTimeout(() => cell.classList.remove("invalid-drop"), 300);
                }
            });
        }
        boardElement.appendChild(cell);
    }
}

function markCell(boardElement, row, col, hit) {
    const index = row * 10 + col;
    const cell = boardElement.querySelector(`[data-index="${index}"]`);
    cell.classList.add(hit ? "hit" : "miss");
}

// marks every cell belonging to a ship as sunk (not just the cell that landed the final hit)
function markSunkShip(boardElement, cells) {
    cells.forEach(({ row, col }) => {
        const index = row * 10 + col;
        const cell = boardElement.querySelector(`[data-index="${index}"]`);
        cell.classList.add("hit", "sunk");
    });
}

// `ships` is an array of { length, name } objects, e.g. { length: 5, name: "Carrier" }
function createShipTray(trayElement, ships, getOrientation, getDraggedShip, setDraggedShip) {
    ships.forEach(({ length, name }) => {
        const shipDiv = document.createElement("div");
        shipDiv.classList.add("ship-container");
        shipDiv.dataset.length = length;
        shipDiv.dataset.name = name;

        const segmentsWrapper = document.createElement("div");
        segmentsWrapper.classList.add("ship-segments");

        for (let i = 0; i < length; i++) {
            const shipPiece = document.createElement("div");
            shipPiece.classList.add("ship-segment");
            segmentsWrapper.appendChild(shipPiece);
        }

        const label = document.createElement("span");
        label.classList.add("ship-label");
        label.textContent = name;

        shipDiv.appendChild(segmentsWrapper);
        shipDiv.appendChild(label);

        shipDiv.draggable = true;

        shipDiv.addEventListener("dragstart", (event) => {
            const orientation = getOrientation();
            setDraggedShip(shipDiv);

            const segmentSize = 50;
            const grabOffset = orientation === "Horizontal"
                ? Math.floor(event.offsetX / segmentSize)
                : Math.floor(event.offsetY / segmentSize);

            event.dataTransfer.setData("text/plain", JSON.stringify({ length, orientation, grabOffset }));
        });

        trayElement.appendChild(shipDiv);
    });
}

function markShip(boardElement, row, col, length, orientation) {
    for (let i = 0; i < length; i++) {
        let segmentRow, segmentCol;
        if (orientation === "Horizontal") {
            segmentRow = row;
            segmentCol = col + i;
        } else {
            segmentRow = row + i;
            segmentCol = col;
        }
        const index = segmentRow * 10 + segmentCol;
        const cell = boardElement.querySelector(`[data-index="${index}"]`);
        cell.classList.add("ship");
    }
}

export { createBoard, markCell, markSunkShip, createShipTray, markShip };