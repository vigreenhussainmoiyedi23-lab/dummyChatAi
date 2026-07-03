import { tool } from "langchain";
import * as z from "zod";

export const imageTool = tool(async ({ title }) => {
    const response = await fetch("https://image.pollinations.ai/prompt/" + title.split(" ").join("+"));

    return response.url
}, {
    name: "image_generation",
    description: "use this to generate Images",
    schema: z.object({
        title: z.string().describe("the prompt for gemini to creeate an image")
    })
})
