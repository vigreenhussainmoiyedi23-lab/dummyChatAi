
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_KEY });
export async function fetchDataFromInternet({ title }) {
    const response = await tvly.search(title);

    return JSON.stringify(response)
}