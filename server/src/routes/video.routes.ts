import { Router } from "express";
import videoController from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.post("/createVideo",videoController.createVideo);
videoRouter.post("/getVideo",videoController.getVideo);
videoRouter.post("/getVideoDetails",videoController.getVideoDetails);
videoRouter.post("/getTranscript", videoController.getTranscript);

export default videoRouter;