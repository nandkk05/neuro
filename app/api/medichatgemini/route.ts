import { queryPineconeVectorStore } from "@/utils";
import { Pinecone } from "@pinecone-database/pinecone";
// import { Message, OpenAIStream, StreamData, StreamingTextResponse } from "ai";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, Message, StreamData, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;
// export const runtime = 'edge';

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY ?? "",
});

const google = createGoogleGenerativeAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: process.env.GEMINI_API_KEY
});

// gemini-2.0-flash
const model = google('models/gemini-2.0-flash', {
    safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ],
});

export async function POST(req: Request, res: Response) {
    const reqBody = await req.json();
    console.log(reqBody);

    const messages: Message[] = reqBody.messages;
    const userQuestion = `${messages[messages.length - 1].content}`;

    const reportData: string = reqBody.data.reportData;
    const query = `Represent this for searching relevant passages: document uploaded by the user says: \n${reportData}. \n\n${userQuestion}`;

    const retrievals = await queryPineconeVectorStore(pinecone, 'neurofin', "ns1", query);

    const finalPrompt = `Here is a summary of a document uploaded by the user, along with a user query. Some generic reference information is also provided, which may or may not be relevant to the document content.
    Carefully review the document summary and respond to the user query.
    Ensure your answer is factually accurate and demonstrates a clear understanding of both the query and the document content.
    You may refer to the generic reference information to enrich your answer, but only include it if it's directly relevant to the document.
    
    \n\n**Document Summary:** \n${reportData}. 
    \n**End of Document Summary** 
    
    \n\n**User Query:**\n${userQuestion}?
    \n**End of User Query** 
    
    \n\n**Generic Reference Information:** 
    \n\n${retrievals}. 
    \n\n**End of Generic Reference Information** 
    
    \n\nProvide thorough justification for your answer.
    \n\n**Answer:**
    `;

    const data = new StreamData();
    data.append({
        retrievals: retrievals
    });

    const result = await streamText({
        model: model,
        prompt: finalPrompt,
        onFinish() {
            data.close();
        }
    });

    return result.toDataStreamResponse({ data });
}

