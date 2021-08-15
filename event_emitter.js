const event = class {
    #on_events = new Map();
    #once_events = new Map();

    constructor() {
    }

    onEvent(name, callback) { //name : String, callback : Function
        this.#on_events.set(name, callback);
    }

    onceEvent(name, callback) { //name : String, callback : Function
        this.#once_events.set(name, callback);
    }

    emitEvent(name, ...args) {
        if (this.#once_events.has(name)) {
            this.#once_events.get(name)(args);
            this.#once_events.delete(name);
        }
        else this.#on_events.get(name)(args);
    }
}

export default event;
