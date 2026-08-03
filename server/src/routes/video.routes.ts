import { Router } from "express";
import videoController from "../controllers/video.controller.js";

import { authMiddleWare } from "../middleware/auth.middleware.js";

const videoRouter = Router();

videoRouter.post("/createVideo", authMiddleWare, videoController.createVideo);
videoRouter.post("/getVideo",authMiddleWare,videoController.getVideo);
videoRouter.post("/getVideoDetails",videoController.getVideoDetails);
videoRouter.post("/getTranscript", videoController.getTranscript);

export default videoRouter;