

//TODO: Think of this view as your game board.
//      Your view should listen to various custom events of your model.
//      For each event of your model, there should be a clear visual
//      representation of what's going on.

//TODO: Update the field. Show the whole battlefield with all the stones
//      that are already played.

//TODO: Show the current player

//TODO: Notify the player when the game is over. Make it clear how the
//      Game ended. If it's a win, show the winning stones.

"use strict";


const view = {

    init() {
        let app = document.getElementById("app");

        app.innerHTML = `
            <div id="connectfour-wrap">
                <div id="connectfour-title">Connect Four</div>
                <div id="connectfour-subtitle">Welcome to Bikini Bottom</div>

                <div class="connectfour-legend">
                    <span class="legend-item" id="legend-1">
                        <span class="connectfour-dot spongebob"></span> SpongeBob
                    </span>
                    <span class="legend-item" id="legend-2">
                        <span class="connectfour-dot patrick"></span> Patrick
                    </span>
                </div>

                <div id="connectfour-status">Lade...</div>
                <div id="connectfour-col-indicators"></div>
                <div id="connectfour-board"></div>

                <button id="connectfour-reset">Neu starten</button>
            </div>
        `;

        document.addEventListener("connectfour:playerchange",  function(e) { view.onPlayerChange(e); });
        document.addEventListener("connectfour:stoneinserted", function(e) { view.onStoneInserted(e); });
        document.addEventListener("connectfour:gameover",      function(e) { view.onGameOver(e); });
    },


    onStoneInserted(event) {
        let board = event.detail.board;
        let boardEl = document.getElementById("connectfour-board");
        boardEl.innerHTML = "";

        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[r].length; c++) {
                let cell = document.createElement("div");
                cell.className = "connectfour-cell";
                cell.dataset.col = c;

                if (board[r][c] === 1) cell.classList.add("p1");
                if (board[r][c] === 2) cell.classList.add("p2");

                boardEl.appendChild(cell);
            }
        }

    },

    onPlayerChange(event) {
        let player = event.detail.player;


        document.getElementById("legend-1").classList.remove("active");
        document.getElementById("legend-2").classList.remove("active");
        document.getElementById("legend-" + player.id).classList.add("active");

        this.setStatus(player.emoji + " " + player.name + " ist dran!");
    },

    onGameOver(event) {
        let result = event.detail;

        if (result.type === "win") {
            let boardEl = document.getElementById("connectfour-board");
            let cells = boardEl.querySelectorAll(".connectfour-cell");

            for (let i = 0; i < result.winningStones.length; i++) {
                let r = result.winningStones[i][0];
                let c = result.winningStones[i][1];
                let index = r * model.cols + c;
                cells[index].classList.add("win");
            }

            this.setStatus(result.player.emoji + " " + result.player.name + " gewinnt! " + result.player.emoji);

        } else {
            this.setStatus("🐟 Unentschieden! Bikini Bottom ist erschöpft.");
        }
    },


    showColumnFullWarning(col) {
        let boardEl = document.getElementById("connectfour-board");
        let cells = boardEl.querySelectorAll(".connectfour-cell");

        for (let i = 0; i < cells.length; i++) {
            if (i % model.cols === col) {
                cells[i].classList.add("warning");
                setTimeout(function() {
                    cells[i].classList.remove("warning");
                }, 500);
            }
        }

        this.setStatus("Diese Spalte ist voll! Wähle eine andere.");

        setTimeout(function() {
            if (!model.gameOver) {
                let p = model.currentPlayer;
                view.setStatus(p.emoji + " " + p.name + " ist dran!");
            }
        }, 1000);
    },


    drawIndicators(numCols) {
        let indEl = document.getElementById("connectfour-col-indicators");
        indEl.innerHTML = "";

        for (let c = 0; c < numCols; c++) {
            let ind = document.createElement("div");
            ind.className = "connectfour-col-ind";
            ind.textContent = "▼";
            ind.dataset.col = c;
            indEl.appendChild(ind);
        }
    },

    setStatus(text) {
        document.getElementById("connectfour-status").textContent = text;
    }

};