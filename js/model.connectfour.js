

//TODO: Think of this model as the game-logic.
//      The model knows everything that is neccessary to manage
//      the game. It knows the players, know who's turn it is,
//      knows all the stones and where they are, knows if the
//      game is over and if so, why (draw or winner). It knows
//      which stones are the winning stones. The model also has
//      sovereignty over the battlefield.
//      First step: Create your model-object with all the properties
//      necessary to store that information.

//TODO: Prepare some customEvents. The model should dispatch events when
//      - The Player Changes
//      - A stone was inserted
//      - The Game is over (Draw or Winner)
//      Don't forget to give your events a namespace.
//      For each customEvent, just make a >method< for your model-object,
//      that, when called, dispatches the event. Nothing else should
//      happen in those methods.


//TODO: Initiate the battlefield. Your model needs a representation of the
//      battlefield as data (two-dimensional array). Obviously, there are
//      no stones yet in the field.

//TODO: The model should offer a method to insert a stone at a given column.
//      If the stone can be inserted, the model should insert the stone,
//      dispatch an event to let the world know that the battlefield has changed
//      and check if the game is over now.
//      Hint: This method will be called later by your controller, when the
//      user makes an according input.

//TODO: Methods to check if the game is over, either by draw or a win.
//      Let the world know in both cases what happend. If it's a win,
//      Don't forget to store the winning stones and add this >detail<
//      to your custom event.

//TODO: Method to change the current player (and dispatch the according event).
"use strict";


const model = {

    rows: 6,
    cols: 7,

    players: [
        { name: "SpongeBob", emoji: "🧽", id: 1 },
        { name: "Patrick",   emoji: "🌟", id: 2 }
    ],


    currentPlayer: null,

    board: [],

    gameOver: false,

    winningStones: [],


    dispatchPlayerChange() {
        let event = new CustomEvent("connectfour:playerchange", {
            detail: { player: this.currentPlayer }
        });
        document.dispatchEvent(event);
    },

    dispatchStoneInserted() {
        let event = new CustomEvent("connectfour:stoneinserted", {
            detail: { board: this.board }
        });
        document.dispatchEvent(event);
    },

    dispatchGameOver(result) {
        let event = new CustomEvent("connectfour:gameover", {
            detail: result
        });
        document.dispatchEvent(event);
    },


    initBoard() {
        this.board = [];

        for (let r = 0; r < this.rows; r++) {
            this.board[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.board[r][c] = 0;
            }
        }
    },


    insertStone(col) {
        if (this.gameOver) return false;
        let targetRow = -1;
        for (let r = this.rows - 1; r >= 0; r--) {
            if (this.board[r][col] === 0) {
                targetRow = r;
                break;
            }
        }

        if (targetRow === -1) return false;
        this.board[targetRow][col] = this.currentPlayer.id;
        this.dispatchStoneInserted();
        this.checkGameOver(targetRow, col);

        return true;
    },


    checkGameOver(row, col) {

        let winning = this.checkWin(row, col);
        if (winning) {
            this.gameOver = true;
            this.winningStones = winning;
            this.dispatchGameOver({
                type: "win",
                player: this.currentPlayer,
                winningStones: this.winningStones
            });
            return;
        }

        let isDraw = true;
        for (let c = 0; c < this.cols; c++) {
            if (this.board[0][c] === 0) {
                isDraw = false;
                break;
            }
        }

        if (isDraw) {
            this.gameOver = true;
            this.dispatchGameOver({ type: "draw" });
            return;
        }

        this.changePlayer();
    },



    checkWin(row, col) {
        let directions = [
            [[0, 1],  [0, -1]],
            [[1, 0],  [-1, 0]],
            [[1, 1],  [-1, -1]],
            [[1, -1], [-1, 1]]
        ];

        let playerId = this.currentPlayer.id;

        for (let i = 0; i < directions.length; i++) {
            let dirA = directions[i][0];
            let dirB = directions[i][1];
            let stones = [[row, col]];

            let allDirs = [dirA, dirB];
            for (let d = 0; d < allDirs.length; d++) {
                let dr = allDirs[d][0];
                let dc = allDirs[d][1];
                let r = row + dr;
                let c = col + dc;

                while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.board[r][c] === playerId) {
                    stones.push([r, c]);
                    r += dr;
                    c += dc;
                }
            }

            if (stones.length >= 4) return stones;
        }

        return null;
    },

    changePlayer() {
        if (this.currentPlayer === this.players[0]) {
            this.currentPlayer = this.players[1];
        } else {
            this.currentPlayer = this.players[0];
        }
        this.dispatchPlayerChange();
    },

    init() {
        this.gameOver = false;
        this.winningStones = [];
        this.currentPlayer = this.players[0];
        this.initBoard();
        this.dispatchPlayerChange();
        this.dispatchStoneInserted();
    }

};