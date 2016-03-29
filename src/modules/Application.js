import Game from './game/Game';

let _game = null;
let _ui = null;
let _config = null;

let _setEvents = function _setEvents() {
    _ui.on('start', () => {
        _game.start();
    });
    _ui.on('fieldPicked', (column, row) => {
        _game.discover(column, row);
    });

    _ui.on('restart', () => {
        _game.restart();
    });

    _game.on('stateChange', (state) => {
        _ui.stateChange(state.currentState);
    });

    _game.on('discover', (field) => {
        _ui.fieldDiscovered(field);
    });

    _game.on('movesCountChange', (count) => {
        _ui.movesCountChange(count);
    });

    _game.on('timerChange', (timer) => {
        _ui.timerChange(timer);
    });
};

export default class Application {
    constructor(ui, config) {
        _ui = ui;
        _config = config;
    }

    init() {
        _game = new Game(_config);
        _setEvents();
    }
}