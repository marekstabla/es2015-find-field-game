let isFunction = function(obj) {
    return typeof obj == 'function' || false;
};

export default class EventEmitter {
    constructor() {
        this.listeners = new Map();
    }

    on(label, callback) {
        this.addListener(label, callback);
    }

    addListener(label, callback) {
        this.listeners.has(label) || this.listeners.set(label, []);
        this.listeners.get(label).push(callback);
    }

    removeListener(label, callback) {
        let listeners = this.listeners.get(label),
            index;

        if (listeners && listeners.length) {
            index = listeners.reduce((i, listener, index) => {
                return (isFunction(listener) && listener === callback) ?
                    i = index :
                    i;
            }, -1);

            if (index > -1) {
                this.listeners.set(label, listeners.splice(index, 1));
                return true;
            }
        }
        return false;
    }

    emit(label, ...args) {
        let listeners = this.listeners.get(label);

        if (listeners && listeners.length) {
            listeners.forEach((listener) => {
                listener(...args);
            });
            return true;
        }
        return false;
    }
}