import prisma from "../lib/prisma.js";

class MessageService {

    async createMessage(
        conversationId: string,
        role: "USER" | "ASSISTANT" | "SYSTEM",
        content: string,
        sourceChunkIds: string[] = []
    ) {
        const message = await prisma.message.create({
            data:{
                conversationId,
                role,
                content,
                sourceChunkIds,
            }
        })

        return message;
    }

}

export default new MessageService();