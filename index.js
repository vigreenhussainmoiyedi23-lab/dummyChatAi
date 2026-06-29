import "dotenv/config"
import sendEmail from "./sendEmail.js";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_KEY });
async function fetchDataFromInternet({ title }) {
    const response = await tvly.search(title);

    return JSON.stringify(response)
}

import { createAgent, HumanMessage, SystemMessage, tool } from "langchain"
import { ChatMistralAI } from "@langchain/mistralai";
import * as readline from 'node:readline/promises';





import { stdin as input, stdout as output } from 'node:process';
import * as z from "zod"

async function askQuestion() {
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

const messages = []
messages.push(new SystemMessage("You are a assistant and also try not to elaborate alot and burn tokens"))
const model = new ChatMistralAI({
    model: "mistral-small-latest",
});
const EmailTool = tool(sendEmail,
    {
        name: "send_email",
        description: "use this to send email",
        schema: z.object({
            subject: z.string().describe("email subject"),
            html: z.string().describe("email body"),
            to: z.string().describe("email recipient")
        })
    }
)
const searchTool = tool(fetchDataFromInternet,
    {
        name: "search",
        description: "use this to search",
        schema: z.object({
            title: z.string().describe("search query")
        })
    }
)
const imageTool = tool(async ({ title }) => {
    const response = await fetch("https://image.pollinations.ai/prompt/" + title.split(" ").join("+"));
 
    return response.url
}, {
    name: "image_generation",
    description: "use this to generate Images",
    schema: z.object({
        title: z.string().describe("the prompt for gemini to creeate an image")
    })
})
const agent = createAgent({
    model,
    tools: [EmailTool, searchTool, imageTool]
})
while (true) {
    const q = await askQuestion();
    messages.push(new HumanMessage(q));

    if (messages.length > 20) {
        messages.splice(1, messages.length - 20);
    }
    const response = await agent.invoke({ messages })
    messages.push(response.messages[response.messages.length - 1])


    console.log("Ai: " + response.messages[response.messages.length - 1].content);
}
