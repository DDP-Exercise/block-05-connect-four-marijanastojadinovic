

/*******************************************************
 *     Connect Four - 100p
 *
 *     It's gaming time! The kids from Kindergarten would
 *     love to play some connect four! Unfortunately, kids
 *     nowadays can't use any wood or paper games anymore.
 *     It's digital or they go crazy. And we don't want crazy,
 *     do we?
 *
 *     Your task is to create a nice game of connect four.
 *     Make it an interesting >digital product< (I've heard
 *     you are an expert for that)! Make it visually appealing.
 *     Wrap it into a story. Choose or create two characters
 *     with rivalry to give your game more flesh. Try to
 *     match the appearance and/or the behavior of the game to
 *     the background-story (character arch).
 *
 *     Technical requirements:
 *     The game should be intuitive to play. It's a children's
 *     game after all. Think of a good way to handle your input.
 *
 *     The two players use the same input method and play in turns
 *     (= No need for separate input).
 *
 *     The game should give some hint or warning, when a player
 *     wants to put a stone on a file that is already full.
 *
 *     The game should give a clear visual representation of
 *     the winning stones and announce the winner.
 *
 *     Use MVC and custom Events. The model dispatches events for:
 *      - Player Change (view visually highlights current player)
 *      - Stone was inserted (view visually represents all the stones)
 *      - Game is over (Draw or Winner)
 *
 *     The creation of this game should take you somewhere between
 *     8-10 hours of concentrated work.
 *     Bratlsoft - 2026-04-29
 *******************************************************/


//TODO: Create your controller-object. When initiated, it should boot
//      the view (or views, if you decide to make a console-view).

//TODO: Add EventListeners, to forward the user inputs to the model.
"use strict";


const controller = {

    init() {
        view.init();
        viewConsole.init();
        model.init();
        this.addEventListeners();
    },

    addEventListeners() {
        document.addEventListener("click", function(event) {

            if (event.target.id === "connectfour-reset") {
                model.init();
                return;
            }

            let col = event.target.dataset.col;
            if (col === undefined) return;
            let success = model.insertStone(Number(col));
            if (!success) {
                view.showColumnFullWarning(Number(col));
            }
        });

        document.addEventListener("mouseover", function(event) {
            let col = event.target.dataset.col;
            if (col === undefined) return;
            controller.showPreview(Number(col));
        });

        document.addEventListener("mouseout", function(event) {
            let col = event.target.dataset.col;
            if (col === undefined) return;
            controller.clearPreview();
        });
    },

    showPreview(col) {
        if (model.gameOver) return;
        this.clearPreview();


        let targetRow = -1;
        for (let r = model.rows - 1; r >= 0; r--) {
            if (model.board[r][col] === 0) {
                targetRow = r;
                break;
            }
        }

        if (targetRow === -1) return;

        let boardEl = document.getElementById("connectfour-board");
        let cells = boardEl.querySelectorAll(".connectfour-cell");
        let index = targetRow * model.cols + col;

        if (model.currentPlayer.id === 1) {
            cells[index].classList.add("preview-p1");
        } else {
            cells[index].classList.add("preview-p2");
        }
    },

    clearPreview() {
        let previews = document.querySelectorAll(".preview-p1, .preview-p2");
        for (let i = 0; i < previews.length; i++) {
            previews[i].classList.remove("preview-p1", "preview-p2");
        }
    }

};


controller.init();
