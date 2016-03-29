import BoardLoader from './BoardLoader';
import EventEmitter from '../utils/EventEmitter';
import GameStates from './GameStates';

let _gameInstance = null;
let _config = null;

export default class Game extends EventEmitter {
    constructor(config) {
        super();
        if (!_gameInstance) {
            _config = config;
            _gameInstance = this;

            BoardLoader.generateBoard(_config.COLUMNS, _config.ROWS).then((board) => {
                _gameInstance._board = board;
                _gameInstance.state = GameStates.READY;
                _gameInstance.movesCount = _config.MAX_MOVES;
                _gameInstance.timer = _config.GAME_TIME;
            });
        }

        return _gameInstance;
    }

    set state(value) {
        let previousState = this._state;

        this._state = value;

        this.emit('stateChange', {
            previousState: previousState,
            currentState: value
        });
    };

    get state() {
        return this._state;
    }

    set movesCount(value) {
        this._movesCount = value;
        this.emit('movesCountChange', value);
    }

    get movesCount() {
        return this._movesCount;
    }

    set timer(value) {
        this._timer = value;
        this.emit('timerChange', value);
    }

    get timer() {
        return this._timer;
    }

    start() {
        this.state = GameStates.STARTED;
        this.movesCount = _config.MAX_MOVES;
        this.timer = _config.GAME_TIME;
            //Set game timeout from config
        this._gameTimeout = setInterval(() => {
            _gameInstance.timer--;

            if (_gameInstance.timer <= 0) {
                _gameInstance.finishGame(GameStates.TIMEOUT);
            }

        }, 1000);
    };

    finishGame(reason) {
        //Clear timeout if game finished
        if (this._gameTimeout) {
            clearInterval(this._gameTimeout);
        }

        this.state = reason;
    };

    discover(column, row) {
        if (this.state != GameStates.STARTED)
            return;

        let field = this._board[row][column];

        if (field.isDiscovered)
            return;

        this.movesCount--;

        let isWinning = field.discover();

        this.emit('discover', {
            position: field.position,
            isWinningField: field.isWinningField,
            isDiscovered: field.isDiscovered
        });

        if (isWinning) {
            this.finishGame(GameStates.WIN);
        } else if (this.movesCount <= 0) {
            this.finishGame(GameStates.NO_MOVES);
        }
    }

    restart() {
        BoardLoader.generateBoard(_config.COLUMNS, _config.ROWS).then((board) => {
            _gameInstance._board = board;
            _gameInstance.start();
        });
    }
}