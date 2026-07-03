import "dotenv/config"
import { createAgent, HumanMessage, SystemMessage } from "langchain"
import { ChatMistralAI } from "@langchain/mistralai";
import { EmailTool } from "./tools/EmailTool.js";
import { searchTool } from "./tools/searchTool.js";
import { imageTool } from "./tools/imageTool.js";
import embeddings from "./config/embedding.js";
import index from "./config/pinecone.js";
import { askQuestion } from "./utils/askQuestion.js";



const messages = []
messages.push(
    new SystemMessage("You are a assistant and also try not to elaborate alot and burn tokens, use all the tools efficently and you have to answer the question, if you don't know the answer then say 'I don't know' and don't try to make up an answer.Use search tool to search the answer and use image generation tool to generate images and use email tool to send emails.")
)


const model = new ChatMistralAI({
    model: "mistral-small-latest",
});
const agent = createAgent({
    model,
    tools: [EmailTool, searchTool, imageTool]
});


while (true) {
    const q = await askQuestion();
    messages.push(new HumanMessage(q));
    const queryEmbeddings = await embeddings.embedQuery(q);
    const result = await index.query({
        vector: queryEmbeddings,
        topK: 5,
        includeMetadata: true
    });
    result.matches.map(item => { messages.push(new SystemMessage("use this data for context" + item.metadata.text)) })
    if (messages.length > 20) {
        messages.splice(1, messages.length - 20);
    }
    const response = await agent.invoke({ messages })
    messages.push(response.messages[response.messages.length - 1])


    console.log("Ai: " + response.messages[response.messages.length - 1].content);
}
