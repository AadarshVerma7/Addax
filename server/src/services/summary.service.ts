import dotenv from "dotenv"
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import prisma from "../lib/prisma.js";

class SummaryService{

    private ai = new GoogleGenAI({
        apiKey : process.env.GEMINI_API_KEY!,
    });

    async generateSummary(videoId: string, transcript: string){

        if(!videoId){
            throw new Error("Video is not found in DB");
        }
            const prompt = `
You are Addax, an expert AI educator.

Your task is to create high-quality study notes from the following YouTube transcript.

Instructions:

- Begin with a short overview.
- Divide the summary into logical sections using Markdown headings.
- Explain the important concepts clearly.
- Preserve technical terminology.
- Mention examples used by the instructor.
- End with a "Key Takeaways" section.
- Keep the summary concise but complete.
- Return ONLY Markdown.

Transcript:

${transcript}
`;
    const response = await this.ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
    });

    return response.text ?? "";
    }



    async getOrCreateSummary(videoId: string){
        const existingSummary = await prisma.summary.findUnique({
            where:{
                videoId: videoId,
            }
        });
        
        if(existingSummary){
            return existingSummary
        }

        const transcript = await prisma.transcript.findUnique({
            where:{
                videoId: videoId,
            }
        });

        if(!transcript){
            throw new Error("Transcript not found in DB");
        }

        const summary = await this.generateSummary(videoId,transcript.fullText);
        const savedSummary = await prisma.summary.create({
            data:{
                videoId,
                content: summary,
            }
        });

        return savedSummary;
    }
}

export default new SummaryService();