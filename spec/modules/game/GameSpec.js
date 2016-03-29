import Game from '../../../src/modules/game/Game';
import GameStates from '../../../src/modules/game/GameStates';
import Config from '../../../src/config/GameConfig';

describe("Game", () => {
    let game = null;

    beforeEach((done) => {
        game = new Game(Config);
        if (game.state) {
            game.finishGame(GameStates.TIMEOUT);
            done();
        }

        game.on('ready', () => {
            done();
        });
    });

    it("should be ready", () => {
        expect(game.state).toEqual(GameStates.READY);
    });

    it("should not discover field", () => {
        let field = game.discover(0, 0);
        expect(field.isDiscovered).toBeFalsy();
    });

    it("should not update moves count", () => {
        let movesCountBefore = game.movesCount;
        game.discover(0, 0);
        expect(game.movesCount).toEqual(movesCountBefore);
    });

    it("should be started", () => {
        game.start();
        expect(game.state).toEqual(GameStates.STARTED);
    });

    it("should discover field", (done) => {
        game.restart().then(() => {
            let field = game.discover(0, 0);
            expect(field.isDiscovered).toBeTruthy();
            done();
        });
    });

    it("should update moves count", (done) => {
        game.restart().then(() => {
            let movesCountBefore = game.movesCount;
            game.discover(0, 0);
            expect(game.movesCount).not.toEqual(movesCountBefore);
            done();
        });
    });

    it("should update timer", (done) => {
        game.restart().then(() => {
            setTimeout(() => {
                expect(game.timer).not.toBeGreaterThan(Config.GAME_TIME);
                done();
            }, 1500);
        });
    });

    it("should finish game", (done) => {
        game.restart().then(() => {
            for (let r = 0; r < Config.ROWS; r++) {
                for (let c = 0; c < Config.COLUMNS; c++) {
                    game.discover(c, r);
                }
            }

            expect([GameStates.NO_MOVES, GameStates.WIN]).toContain(game.state);
            done();
        });
    });


});
