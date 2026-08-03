import retrievalService from "./retrieval.service.js";
import groqService from "./groq.service.js";
import prisma from "../lib/prisma.js";
import messageService from "./message.service.js";
class ChatService {
    async chat(conversationId, question) {
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            }
        });
        if (!conversation) {
            throw new Error("Conversation Not Found!");
        }
        await messageService.createMessage(conversationId, "USER", question);
        const videoId = conversation.videoId;
        const chunks = await retrievalService.retrieveRelevantChunks(videoId, question);
        // console.log("Retrieved Chunks:", chunks.length);
        // console.log(chunks);
        const context = chunks.map((chunk) => `[${chunk.startTime.toFixed(1)}s - ${chunk.endTime.toFixed(1)}s]
                ${chunk.content}`).join("\n\n");
        if (chunks.length === 0) {
            return `
I couldn't find any relevant explanation for your question in the video's transcript.

This can happen if:
• The topic isn't discussed in the video.
• The wording of your question differs significantly from the transcript.
• The retrieval system couldn't locate the relevant segment.

Try rephrasing your question or asking about a specific concept covered in the video.
`;
        }
        // console.log("Context:\n", context)
        const systemPrompt = `
            You are Addax, an AI educator.

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
            `;
        const userPrompt = `
            Transcript Context:
            ${context}
            
            Question:
            ${question}
        `;
        // console.log(userPrompt)
        const response = await groqService.generateResponse([
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: userPrompt,
            }
        ]);
        await messageService.createMessage(conversation.id, "ASSISTANT", response, chunks.map(chunk => chunk.id));
        return response;
    }
}
export default new ChatService();
//# sourceMappingURL=chat.service.js.map