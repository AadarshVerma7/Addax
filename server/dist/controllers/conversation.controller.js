import conversationService from "../services/conversation.service.js";
class ConversationController {
    async getUserConversations(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const conversations = await conversationService.getUserConversations(userId);
            return res.status(200).json({
                success: true,
                conversations,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getConversationMessages(req, res) {
        try {
            const conversationId = req.params;
            if (!conversationId) {
                return res.status(400).json({
                    success: false,
                    message: "Conversation id is required."
                });
            }
            const messages = await conversationService.getConversationMessages(conversationId.conversationId);
            return res.status(200).json({
                success: true,
                messages,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}
export default new ConversationController();
//# sourceMappingURL=conversation.controller.js.map