import { Router } from "express";
import videoController from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.post("/createVideo",videoController.createVideo);
videoRouter.get("/getVideo",videoController.getVideo);

export default videoRouter;