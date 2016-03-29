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
let _timer = null;

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
    _timer = document.getElementById('timer');

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

            this.on('ready', () => {
                _uiInstance.ready = true;
            });

            _initialize();
            _initializeBoard(_config.COLUMNS, _config.ROWS, 'ready');

        }

        return _uiInstance;
    }

    get document() {
        return this._document;
    }

    set ready(value) {
        this._ready = value;
    }

    get ready() {
        return this._ready;
    }

    stateChange(state) {
        switch (state) {
            case GameStates.READY:
                if (_state)
                    _state.innerHTML = "Game is ready";
                break;

            case GameStates.STARTED:
                if (_state)
                    _state.innerHTML = 'Game started';
                _hideElement(_restartButton);
                break;

            case GameStates.WIN:
                if (_state)
                    _state.innerHTML = 'You won!';
                _showElement(_restartButton);
                break;


            case GameStates.TIMEOUT:
                if (_state)
                    _state.innerHTML = 'You lost (timeout)';
                _showElement(_restartButton);
                _hideElement(_board);
                break;

            case GameStates.NO_MOVES:
                if (_state)
                    _state.innerHTML = 'You lost (out of moves)';
                _showElement(_restartButton);
                _hideElement(_board);
                break;

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

    timerChange(timer) {
        if (_timer)
            _timer.innerHTML = timer;
    }
}