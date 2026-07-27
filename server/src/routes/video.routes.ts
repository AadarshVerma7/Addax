import { Router } from "express";
import videoController from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.post("/createVideo",videoController.createVideo);
videoRouter.get("/getVideo",videoController.getVideo);
videoRouter.get("/getTranscript", videoController.getTranscript);

export default videoRouter;