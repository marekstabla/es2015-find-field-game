import EventEmitter from '../utils/EventEmitter';

let _uiInstance = null;
let DOCUMENT = null;

export default class UI extends EventEmitter {
    constructor(doc) {
        if (!_uiInstance) {
            super();
            DOCUMENT = doc;
            _uiInstance = this;

            //Wait for document ready
            let ready = setInterval(function () {
                if (DOCUMENT.readyState !== 'complete') return;
                clearInterval(ready);
                _uiInstance.emit('ready');
            }, 100);
        }

        return _uiInstance;
    }

    get document() {
        return this._document;
    }
}