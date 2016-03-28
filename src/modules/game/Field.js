export default class Field {
    constructor(column, row) {
        //Set fields as undiscovered and not winning by default
        this._position = {column: column, row: row};
        this._isDiscovered = false;
        this._isWinningField = false;
    }

    get isDiscovered() {
        return this._isDiscovered;
    }

    get isWinningField() {
        return this._isWinningField;
    }

    get position() {
        return this._position;
    }

    discover() {
        this._isDiscovered = true;
        return this._isWinningField;
    }

    markAsWinningField() {
        this._isWinningField = true;
    }
}