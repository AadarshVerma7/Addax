import { YoutubeTranscript } from "youtube-transcript";
import prisma from "../lib/prisma.js";
import { TRANSCRIPT_SOURCE } from "@prisma/client";

class TranscriptService {
    async getTranscript(youtubeId: string) {
        try {
            const transcript = await YoutubeTranscript.fetchTranscript(youtubeId);

            const formattedTranscript = transcript.map(item => ({
                text : item.text,
                startTime : item.offset / 1000,
                endTime : (item.offset + item.duration) / 1000,
                duration : item.duration / 1000
            }));

            return formattedTranscript;
        } catch (error) {
            throw new Error("Failed to fetch transcript");
        }
    }

    async saveTranscript(videoId : string, youtubeId: string){
        const transcript = await this.getTranscript(youtubeId);
        
        const fullText = transcript.map(segment => segment.text).join(" ");
        const savedTranscript = await prisma.transcript.create({
            data: {
                videoId,
                language: null,
                source : TRANSCRIPT_SOURCE.YOUTUBE_CAPTIONS,
                fullText,
            }
        })

        return savedTranscript;
    }
}

export default new TranscriptService();