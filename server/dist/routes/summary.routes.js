import { Router } from "express";
import summaryController from "../controllers/summary.controller.js";
import { authMiddleWare } from "../middleware/auth.middleware.js";
const SummaryRouter = Router();
SummaryRouter.post("/generateSummary", authMiddleWare, summaryController.getSummary);
export default SummaryRouter;
//# sourceMappingURL=summary.routes.js.map