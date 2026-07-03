import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import index from "../config/pinecone";
import embeddings from "../config/embedding";

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 0 })

async function loadPdf({ path = "./resume.pdf" }) {
    try {
        const loader = new PDFLoader(path);
        const docs = await loader.load();

        const texts = await splitter.splitText(docs[0].pageContent);
        const embeds = await Promise.all(texts.map(async (text) => {
            return { text, embed: await embeddings.embedQuery(text) }
        }));
        const result = await index.upsert({
            records: embeds.map((item, i) => ({
                id: `doc-${i}`,
                values: item.embed,
                metadata: { text: item.text }
            }))
        })
        return result
    } catch (error) {
        console.error("Error loading PDF:", error);
    }
}

export default loadPdf;