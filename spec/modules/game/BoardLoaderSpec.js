import BoardLoader from '../../../src/modules/game/BoardLoader';

describe("BoardLoader", () => {
    it("should generate board with specified size", (done) => {
        let cols = 2;
        let rows = 5;
        BoardLoader.generateBoard(cols, rows).then((board) => {
            expect(board.length).toEqual(rows);
            expect(board[0].length).toEqual(cols);
            done();
        });
    });

    it("should generate board with winning field", (done) => {
        let cols = 2;
        let rows = 5;
        BoardLoader.generateBoard(cols, rows).then((board) => {
            let foundWinningField = false;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (!foundWinningField) {
                        foundWinningField = board[r][c].isWinningField;
                    }
                }
            }

            expect(foundWinningField).toBeTruthy();
            done();
        });
    });
});
