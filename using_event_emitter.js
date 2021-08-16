import event from './event_emitter.js';

const event_emitter = new event();
let condition_variable = 0, event_ordering = 1;

const async_api = (number) => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(condition_variable, 'End!');
            resolve();
        }, 500);

    })
} // API


const waiting_prev_api = () => {
    return new Promise(resolve => {
        event_emitter.onceEvent(`${event_ordering++}End`, resolve) // 전 Event Waiting
    })
}

const call_api = async () => {
    if (condition_variable) await waiting_prev_api();
    condition_variable++;
    await async_api(); //Waiting Point
    event_emitter.emitEvent(`${condition_variable}End`);
}

call_api();
call_api();
call_api();
