import * as readline from 'node:readline/promises';
const input = process.stdin;
const output = process.stdout;
export async function askQuestion() {
    // 1. Create the interface linked to terminal input and output
    const rl = readline.createInterface({ input, output });

    try {
        // 2. Wait for user response
        const q = await rl.question('You: ');
        return q
    } finally {
        // 3. Always close the interface to prevent memory leaks or frozen terminals
        rl.close();
    }
}