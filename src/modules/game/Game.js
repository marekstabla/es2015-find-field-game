import Board from './Board';
import EventEmitter from '../utils/EventEmitter';

//Game States
const READY = Symbol();
const STARTED = Symbol();
const WIN = Symbol();
const TIMEOUT = Symbol();

let GAME_STATES = {};
GAME_STATES[READY] = 'READY';
GAME_STATES[STARTED] = 'STARTED';
GAME_STATES[WIN] = 'WIN';
GAME_STATES[TIMEOUT] = 'TIMEOUT';

let _gameInstance = null;
let Config = null;

export default class Game extends EventEmitter {
    constructor(config) {
        super();
        if (!_gameInstance) {
            Config = config;

            this._board = new Board(Config.COLUMNS, Config.ROWS).board;
            _gameInstance = this;

            //Notify about "ready" state after object is initialized
            setTimeout(() => {
                _gameInstance.state = GAME_STATES[READY];
            })
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

    start() {
        this.state = GAME_STATES[STARTED];

        //Set game timeout from config
        this._gameTimeout = setTimeout(() => {
            this.finishGame(GAME_STATES[TIMEOUT])
        }, Config.GAME_TIME * 1000);
    };

    finishGame(reason) {
        //Clear timeout if game finished
        if (this._gameTimeout) {
            clearTimeout(this._gameTimeout);
        }

        this.state = reason;
    };

    discover(column, row) {
        let field = this._board[column][row];

        let isWinning = field.discover();

        this.emit('discover', {
            position: field.position,
            isWinningField: field.isWinningField,
            isDiscovered: field.isDiscovered
        });

        if (isWinning) {
            this.finishGame(GAME_STATES[WIN]);
        }
    }

    restart() {
        this._board = new Board(Config.COLUMNS, Config.ROWS).board;
        this._state = GAME_STATES[READY];
    }
}