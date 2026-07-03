import { fetchDataFromInternet } from "../services/fetchDataFromInternet.js";
import { tool } from "langchain";
import * as z from "zod";
export const searchTool = tool(fetchDataFromInternet,
    {
        name: "search",
        description: "use this to search",
        schema: z.object({
            title: z.string().describe("search query")
        })
    }
)