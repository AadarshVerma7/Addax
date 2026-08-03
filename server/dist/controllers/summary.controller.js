import summaryService from "../services/summary.service.js";
class SummaryController {
    async getSummary(req, res) {
        try {
            const userId = req.userId;
            const videoId = req.body.videoId;
            if (!userId) {
                throw new Error("User not found");
            }
            const summary = await summaryService.getOrCreateSummary(videoId);
            return res.status(200).json({
                success: true,
                summary,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
}
export default new SummaryController();
//# sourceMappingURL=summary.controller.js.map