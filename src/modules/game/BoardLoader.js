import Field from './Field';

let _generateBoard = function generateBoard(columns, rows) {
    return new Promise((resolve) => {
        //Generate board as 2-dimensional array
        let board = [];

        //Generate Rows
        for (let r = 0; r < rows; r++) {
            board.push([]);

            //Generate Columns
            for (let c = 0; c < columns; c++) {
                board[r].push(new Field(c, r));
            }
        }
        console.log("resolved?");
        resolve(board);
    });
};

let _pickRandomWinningField = function pickRandomWinningField(board, columns, rows) {
    console.log("picking");
    //Pick random integer between 0 and columns/rows
    let randomCol = Math.floor(Math.random() * columns);
    let randomRow = Math.floor(Math.random() * rows);

    //Mark Field as winning
    board[randomRow][randomCol].markAsWinningField();
};

export default class BoardLoader {
    static generateBoard(columns, rows) {
        return new Promise((resolve) => {
            _generateBoard(columns, rows).then((board) => {
                _pickRandomWinningField(board, columns, rows);
                console.log(board);
                resolve(board);
            })
        });
    }
}