

//TODO: Optional: Create a console-view to test your Game.
"use strict";
const viewConsole = {

    init() {
        document.addEventListener("connectfour:playerchange",  (e) => this.onPlayerChange(e));
        document.addEventListener("connectfour:stoneinserted", (e) => this.onStoneInserted(e));
        document.addEventListener("connectfour:gameover",      (e) => this.onGameOver(e));

        console.log("Console-View gestartet. Viel Spaß in Bikini Bottom!");
    },

    onPlayerChange(event) {
        const p = event.detail.player;
        console.log(`\n👉 ${p.emoji} ${p.name} ist dran!`);
    },

    onStoneInserted(event) {
        const board = event.detail.board;
        console.log("\nSpielfeld:");
        board.forEach(row => {
            const line = row.map(cell => {
                if (cell === 1) return "🟡";
                if (cell === 2) return "🩷";
                return "⬜";
            }).join(" ");
            console.log(line);
        });
    },

    onGameOver(event) {
        const result = event.detail;
        if (result.type === "win") {
            console.log("\n" + result.player.name + " GEWINNT!");
            console.log("Gewinn-Steine:", result.winningStones);
        } else {
            console.log("\nUnentschieden!");
        }
    }
};