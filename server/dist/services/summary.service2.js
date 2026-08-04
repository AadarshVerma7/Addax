import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import prisma from "../lib/prisma.js";
class SummaryService {
    summaryModels = [
        "gemini-3.5-flash",
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
    ];
    ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || process.env.YOUTUBE_API_KEY || "",
    });
    async generateSummary(videoId, transcript) {
        if (!videoId) {
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
        for (const model of this.summaryModels) {
            try {
                const response = await this.ai.models.generateContent({
                    model,
                    contents: prompt,
                });
                const summary = response.text?.trim();
                if (summary) {
                    return summary;
                }
            }
            catch (error) {
                console.warn(`Summary generation failed with ${model}:`, error);
            }
        }
        throw new Error("Summary not available currently");
    }
    async getOrCreateSummary(videoId) {
        const existingSummary = await prisma.summary.findUnique({
            where: {
                videoId: videoId,
            }
        });
        if (existingSummary) {
            return existingSummary;
        }
        const transcript = await prisma.transcript.findUnique({
            where: {
                videoId: videoId,
            }
        });
        if (!transcript) {
            throw new Error("Transcript not found in DB");
        }
        const summary = await this.generateSummary(videoId, transcript.fullText);
        try {
            const savedSummary = await prisma.summary.create({
                data: {
                    videoId,
                    content: summary,
                }
            });
            return savedSummary;
        }
        catch (error) {
            // Handle unique constraint failure (e.g. if created concurrently)
            if (error.code === "P2002") {
                const existing = await prisma.summary.findUnique({
                    where: {
                        videoId: videoId,
                    }
                });
                if (existing) {
                    return existing;
                }
            }
            throw error;
        }
    }
}
export default new SummaryService();
//# sourceMappingURL=summary.service2.js.map