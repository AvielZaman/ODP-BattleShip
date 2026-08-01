function createBoard(boardElement, isEnemy = false, attackCallback, placeShipCb, getDraggedShip = null, onAllShipsPlaced = null) {
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;

        if (isEnemy) {
            cell.addEventListener("click", () => {
                const row = Math.floor(i / 10);
                const col = Math.floor(i % 10);
                const { valid, gameOver, winner, hit } = attackCallback(row, col);
                if (valid)
                    markCell(boardElement, row, col, hit);
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

function createShipTray(trayElement, shipLengths, getOrientation, getDraggedShip, setDraggedShip) {
    shipLengths.forEach(length => {
        const shipDiv = document.createElement("div");
        shipDiv.classList.add("ship-container");
        shipDiv.dataset.length = length;
        for (let i = 0; i < length; i++) {
            const shipPiece = document.createElement("div");
            shipPiece.classList.add("ship-segment");
            shipDiv.appendChild(shipPiece);
        }

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

export { createBoard, markCell, createShipTray, markShip };