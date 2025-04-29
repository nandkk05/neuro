import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});

const prompt = `Attached is an image of a document. 
Review the document carefully and identify any data points, indicators, or values that show notable deviations or abnormalities. Then summarize the key findings in approximately 100 words. You may exceed the word limit if the document spans multiple pages. 
Make sure to include relevant numerical values and key details from the document, such as section titles or headers when applicable.
## Summary: `;

export async function POST(req: Request, res: Response) {
    const { base64 } = await req.json();
    const filePart = fileToGenerativePart(base64)

    console.log(filePart);
    const generatedContent = await model.generateContent([prompt, filePart]);

    console.log(generatedContent);
    const textResponse = generatedContent.response.candidates![0].content.parts[0].text;
    return new Response(textResponse, { status: 200 })
}

function fileToGenerativePart(imageData: string) {
    return {
        inlineData: {
            data: imageData.split(",")[1],
            mimeType: imageData.substring(
                imageData.indexOf(":") + 1,
                imageData.lastIndexOf(";")
            ),
        },
    }
}