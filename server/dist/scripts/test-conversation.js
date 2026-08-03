import dotenv from "dotenv";
dotenv.config();
import prisma from "../lib/prisma.js";
import conversationService from "../services/conversation.service.js";
import messageService from "../services/message.service.js";
async function main() {
    // Get an existing conversation
    const conversation = await prisma.conversation.findFirst();
    if (!conversation) {
        throw new Error("No conversation found");
    }
    console.log("Conversation ID:", conversation.id);
    // Create a user message
    const userMessage = await messageService.createMessage(conversation.id, "USER", "What is CAP theorem?");
    console.log("\nUser Message Created:");
    console.log(userMessage);
    // Create an assistant message
    const assistantMessage = await messageService.createMessage(conversation.id, "ASSISTANT", "CAP theorem states that a distributed system can guarantee only two of Consistency, Availability and Partition Tolerance.", []);
    console.log("\nAssistant Message Created:");
    console.log(assistantMessage);
    // Fetch the newest paginated conversation messages as the conversation owner.
    const messages = await conversationService.getConversationMessages(conversation.id, conversation.userId);
    console.log("\nConversation History:");
    console.log(messages);
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=test-conversation.js.map