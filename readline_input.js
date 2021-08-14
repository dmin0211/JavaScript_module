import ReadLine from 'readline';

// 입력 Question : Prompt
const input = (question) => {
    const rl = ReadLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.setPrompt(question);
    rl.prompt();
    return new Promise((resolve, reject) => {
        let input_string = "";
        rl.on('line', line => {
            input_string = line; // enter key 전까지 입력된 String
            rl.close();
        })
        rl.on('close', () => {
            resolve(input_string);
        })
    })
}

export {input};
