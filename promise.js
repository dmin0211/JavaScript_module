const PromiseState = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
};

class Promise {
    #state = PromiseState.PENDING;

    #onFulfilled = [];

    #onRejected = [];

    #value;

    constructor(executor) {
        executor(this.resolve.bind(this), this.reject.bind(this));
    }

    #commonOperation(value, state) {
        const observer =
            state === PromiseState.FULFILLED ? this.#onFulfilled : this.#onRejected;
        if (value instanceof Promise) {
            value
                .then((inner_value) => {
                    this.#value = inner_value;
                    this.#state = PromiseState.FULFILLED;
                    this.#onFulfilled.forEach((callback) => callback());
                })
                .catch((inner_error) => {
                    this.#value = inner_error;
                    this.#state = PromiseState.REJECTED;
                    this.#onRejected.forEach((callback) => callback());
                });
        } else {
            this.#value = value;
            this.#state = state;
            observer.forEach((callback) => callback());
        }
    }

    resolve(value) {
        this.#commonOperation(value, PromiseState.FULFILLED);
    }

    reject(value) {
        this.#commonOperation(value, PromiseState.REJECTED);
    }

    #handleCallback(callback, resolve, reject) {
        try {
            resolve(callback(this.#value));
        } catch (e) {
            reject(e);
        }
    }

    #onThenPendingCallback(callback, resolve, reject) {
        this.#onFulfilled.push(() =>
            this.#handleCallback(callback, resolve, reject)
        );
        this.#onRejected.push(() => reject(this.#value));
    }

    #onCatchPendingCallback(callback, resolve, reject) {
        this.#onFulfilled.push(() => resolve(this.#value));
        this.#onRejected.push(() =>
            this.#handleCallback(callback, resolve, reject)
        );
    }

    #promiseScheduling(callback, method) {
        const state =
            method === 'then' ? PromiseState.FULFILLED : PromiseState.REJECTED;
        if (this.#state === PromiseState.PENDING) {
            return new Promise((resolve, reject) => {
                return state === PromiseState.FULFILLED
                    ? this.#onThenPendingCallback(callback, resolve, reject)
                    : this.#onCatchPendingCallback(callback, resolve, reject);
            });
        }

        if (this.#state === state) {
            return new Promise((resolve) => {
                resolve(callback(this.#value));
            });
        }
        return new Promise((resolve, reject) => {
            return state === PromiseState.FULFILLED
                ? reject(this.#value)
                : resolve(this.#value);
        });
    }

    then(callback) {
        return this.#promiseScheduling(callback, 'then');
    }

    catch(callback) {
        return this.#promiseScheduling(callback, 'catch');
    }
}

export default Promise;
