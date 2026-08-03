import prisma from "../lib/prisma.js";
class MessageService {
    async createMessage(conversationId, role, content, sourceChunkIds = []) {
        const message = await prisma.message.create({
            data: {
                conversationId,
                role,
                content,
                sourceChunkIds,
            }
        });
        return message;
    }
}
export default new MessageService();
//# sourceMappingURL=message.service.js.map