import dotenv from "dotenv";
dotenv.config();

import prisma from "../lib/prisma.js";

class SummaryService {
  private readonly summaryModels = [
    "google/gemini-2.5-flash",
    "google/gemini-2.5-flash-lite",
    "meta-llama/llama-3.3-70b-instruct",
    "deepseek/deepseek-chat-v3.1",
    "qwen/qwen3-235b-a22b-thinking-2507",
  ];

  private readonly apiKey = process.env.OPENROUTER_API_KEY!;

  async generateSummary(videoId: string, transcript: string) {
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
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://yourdomain.com",
              "X-Title": "Addax",
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: "system",
                  content:
                    "You are an expert AI educator who creates high-quality study notes.",
                },
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: 0.3,
              max_tokens: 4096,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();

        const summary =
          data?.choices?.[0]?.message?.content?.trim();

        if (summary) {
          return summary;
        }
      } catch (error) {
        console.warn(`Summary generation failed with ${model}:`, error);
      }
    }

    throw new Error("Summary not available currently");
  }

  async getOrCreateSummary(videoId: string) {
    const existingSummary = await prisma.summary.findUnique({
      where: {
        videoId,
      },
    });

    if (existingSummary) {
      return existingSummary;
    }

    const transcript = await prisma.transcript.findUnique({
      where: {
        videoId,
      },
    });

    if (!transcript) {
      throw new Error("Transcript not found in DB");
    }

    const summary = await this.generateSummary(
      videoId,
      transcript.fullText
    );

    try {
      const savedSummary = await prisma.summary.create({
        data: {
          videoId,
          content: summary,
        },
      });

      return savedSummary;
    } catch (error: any) {
      if (error.code === "P2002") {
        const existing = await prisma.summary.findUnique({
          where: {
            videoId,
          },
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