function pipe(...functions) {
    return (first_value) =>
        functions.reduce((prev_value, func) => func(prev_value), first_value);
}

function pipePromise(functions) {
    return (first_value) =>
        functions.reduce(async (prev_value, func, index) => {
            const value = await prev_value;
            return func(value);
        }, Promise.resolve(first_value));
}

export { pipe, pipePromise };
