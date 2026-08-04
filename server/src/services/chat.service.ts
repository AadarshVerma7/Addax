import retrievalService from "./retrieval.service.js";
import groqService from "./groq.service.js";
import prisma from "../lib/prisma.js";
import messageService from "./message.service.js";

class ChatService {
    async chat(conversationId: string, question: string, userId?: string) {
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation) {
            throw new Error("Conversation Not Found!");
        }

        if (userId && conversation.userId !== userId) {
            throw new Error("You do not have access to this conversation.");
        }

        const user = userId
            ? await prisma.user.findUnique({ where: { id: userId }, select: { name: true } })
            : null;

        if (userId && !user) {
            throw new Error("User not found.");
        }

        // Persist the user's message before retrieval, so every request has a complete audit trail.
        const userMessage = await messageService.createMessage(
            conversationId,
            "USER",
            question,
            [],
            user?.name,
        );

        const chunks = await retrievalService.retrieveRelevantChunks(conversation.videoId, question);
        let response: string;

        if (chunks.length === 0) {
            response = "I couldn't find a relevant explanation in this video's transcript. Try rephrasing your question or asking about a specific concept from the video.";
        } else {
            const context = chunks.map((chunk) =>
                `[${chunk.startTime.toFixed(1)}s - ${chunk.endTime.toFixed(1)}s]\n${chunk.content}`
            ).join("\n\n");
            
            const systemPrompt = `You are Addax, an AI educator.

Your primary responsibility is to teach the concepts from the uploaded YouTube video.

When answering:

1. Use the retrieved transcript context as your PRIMARY source.
2. If the transcript already explains the answer, build upon it instead of replacing it.
3. You may use your own computer science knowledge ONLY to:
   - clarify difficult concepts,
   - provide intuition,
   - give examples,
   - fill in gaps that the transcript does not cover.
4. Never contradict the transcript.
5. If additional knowledge is used, naturally blend it into the explanation rather than stating "I'm using my own knowledge."
6. If relevant, mention timestamps from the transcript so the student can revisit that part of the video.
7. Explain concepts like an experienced university professor using clear, structured explanations.
8. Prefer concise but complete answers over unnecessarily long ones.
9. Give response in Markdown`
            response = await groqService.generateResponse([
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: `Transcript Context:\n${context}\n\nQuestion:\n${question}`,
                },
            ]);
        }

        // Always persist the assistant response, including the no-retrieval fallback.
        const assistantMessage = await messageService.createMessage(
            conversation.id,
            "ASSISTANT",
            response,
            chunks.map((chunk) => chunk.id),
            "Addax",
        );

        return { userMessage, assistantMessage };
    }
}

export default new ChatService();
