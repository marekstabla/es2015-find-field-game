import Field from './Field';

let _generateBoard = function generateBoard(columns, rows) {
    "use strict";

    //Generate board as 2-dimensional array
    let board = [];

    //Generate Columns
    for (let c = 0; c < columns; c++) {
        board.push([]);

        //Generate rows
        for (let r = 0; r < rows; r++) {
            board[c].push(new Field(c, r));
        }
    }

    return board;
};

let _pickRandomWinningField = function pickRandomWinningField(board, columns, rows) {
    "use strict";

    //Pick random integer between 0 and columns/rows
    let randomCol = Math.floor(Math.random() * columns);
    let randomRow = Math.floor(Math.random() * rows);

    //Mark Field as winning
    board[randomCol][randomRow].markAsWinningField();
};

export default class Board {
    constructor(columns, rows) {
        this._board = _generateBoard(columns, rows);

        //Pick random winning field
        _pickRandomWinningField(this._board, columns, rows);
    }

    get board() {
        return this._board;
    }
}