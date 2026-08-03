import { Request, Response } from "express";
import summaryService from "../services/summary.service.js";

class SummaryController{
    async getSummary(req: Request, res: Response){
        try {
            const userId = req.userId;
            const videoId = req.body.videoId;
            if(!userId){
                throw new Error("User not found");
            }

            const summary = await summaryService.getOrCreateSummary(videoId);
            
            return res.status(200).json({
                success: true,
                summary,
            })
        } catch (error : any) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
}

export default new SummaryController();