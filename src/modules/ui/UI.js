import EventEmitter from '../utils/EventEmitter';
import GameStates from '../game/GameStates';

let _uiInstance = null;
let _document = null;
let _config = null;

let _game = null;
let _loader = null;
let _board = null;
let _startButton = null;
let _restartButton = null;
let _state = null;
let _fieldBoard = null;
let _movesCount = null;

let _initialize = function _initialize() {
    _game = _document.getElementById('game');
    _loader = _document.getElementById('loader');

    _startButton = _document.getElementById('startButton');
    _showElement(_startButton);

    _restartButton = document.getElementById('restartButton');
    _hideElement(_restartButton);

    _board = _document.getElementById('board');
    _hideElement(_board);

    _state = _document.getElementById('state');
    _movesCount = document.getElementById('movesCount');

    _initializeEvents();
};

let _initializeEvents = function _initializeEvents() {
    _startButton.onclick = () => {
        _hideElement(_startButton);
        _showElement(_board);

        let ready = setInterval(function () {
            if (_document.readyState !== 'complete') return;
            clearInterval(ready);
            _uiInstance.emit('start');
        }, 100);
    };

    _restartButton.onclick = () => {
        _hideElement(_startButton);
        _hideElement(_restartButton);
        _showElement(_board);
        _initializeBoard(_config.COLUMNS, _config.ROWS, 'restart');
    };
};

let _hideElement = function (element) {
    if (element)
        element.classList.add('hidden');
};

let _showElement = function (element) {
    if (element)
        element.classList.remove('hidden');
};

let _initializeBoard = function _initializeBoard(columns, rows, event) {
    _hideElement(_game);
    _showElement(_loader);
    _board.innerHTML = '';
    _fieldBoard = [];

    for (let r = 0; r < rows; r++) {
        //Generate rows
        let row = _document.createElement('div');
        row.classList.add('row');
        _fieldBoard.push([]);

        for (let c = 0; c < columns; c++) {
            let column = _document.createElement('div');
            let field = _createField(c, r);
            column.appendChild(field);
            row.appendChild(column);
            _fieldBoard[r].push(field);
        }
        _board.appendChild(row);
    }

    let ready = setInterval(function () {
        if (_document.readyState !== 'complete') return;
        clearInterval(ready);
        _uiInstance.emit(event);
        _hideElement(_loader);
        _showElement(_game);
    }, 100);
};

let _createField = function _createField(column, row) {
    let field = _document.createElement('div');
    field.classList.add('field');
    field.innerHTML = '&nbsp';
    field.dataset.column = column;
    field.dataset.row = row;

    field.addEventListener('click', () => {
        _uiInstance.emit('fieldPicked', column, row);
    });

    return field;
};

export default class UI extends EventEmitter {
    constructor(doc, config) {
        if (!_uiInstance) {
            super();
            _document = doc;
            _config = config;
            _uiInstance = this;

            _initialize();
            _initializeBoard(_config.COLUMNS, _config.ROWS, 'ready');
        }

        return _uiInstance;
    }

    get document() {
        return this._document;
    }

    stateChange(state) {
        if (_state)
            _state.innerHTML = state;

        if (state === GameStates.STARTED) {
            _hideElement(_restartButton);
        } else if (state === GameStates.WIN) {
            _showElement(_restartButton);
        } else if (state === GameStates.TIMEOUT || state === GameStates.NO_MOVES) {
            _showElement(_restartButton);
            _hideElement(_board);
        }
    }

    fieldDiscovered(field) {
        let uiField = _fieldBoard[field.position.row][field.position.column];

        if (field.isWinningField) {
            uiField.classList.add('winning');
        } else {
            uiField.classList.add('discovered');
        }
    }

    movesCountChange(count) {
        if (_movesCount)
            _movesCount.innerHTML = count;
    }
}