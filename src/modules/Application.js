import Game from './game/Game';

let _game = null;
let _ui = null;

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
        console.log('Discovering field', field);
        _ui.fieldDiscovered(field);
    });

    _game.on('movesCountChange', (count) => {
        _ui.movesCountChange(count);
    });
};

export default class Application {
    constructor(ui, config) {
        _ui = ui;
        _ui.on('ready', () => {
            _game = new Game(config);
            _setEvents();
        });
    }
}