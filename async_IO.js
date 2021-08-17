// https://www.python2.net/questions-1245324.htm
const stdin = process.stdin, stdout = process.stdout;
let prompt = ""; // prompt
let input_string = ""; // input line
stdin.setRawMode(true);
stdin.setEncoding('utf8');

stdin.on('data', (key) => { // key : one char pressed keyboard
    switch (key) {
        case '\u001B\u005B\u0041'://up
        case '\u001B\u005B\u0043'://right
        case '\u001B\u005B\u0042'://down
        case '\u001B\u005B\u0044'://left
            break;
        case '\u0003': //^C
            process.exit();
        case '\u000d': //\n
            // Line Input End
            break;
        case '\u007f': // delete
            // Delete key
            break;
        default: //input text
            stdout.write(key); // 입력값 View
            input_string += key;
            break;
    }
});


setInterval(() => {
    console.clear();
    // Dash Board
    stdout.write(prompt + input_string);
}, 500);
