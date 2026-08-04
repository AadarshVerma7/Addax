import { YoutubeTranscript } from "youtube-transcript";
import prisma from "../lib/prisma.js";
import { ERROR_CODE, TRANSCRIPT_SOURCE } from "@prisma/client";
import { TranscriptSegment, TranscriptChunk } from "../types/transcript.types..js";
import embeddingService from "./embedding.service.js";

export class TranscriptFetchError extends Error {
    readonly code = ERROR_CODE.TRANSCRIPT_NOT_AVAILABLE;

    constructor(message: string) {
        super(message);
        this.name = "TranscriptFetchError";
    }
}

class TranscriptService {
    async getTranscript(youtubeId: string): Promise<TranscriptSegment[]> {
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
            const providerMessage = error instanceof Error ? error.message : String(error);
            const message = this.getUserFacingError(providerMessage);

            // Keep the provider error in Render logs; previously it was replaced by a
            // generic error, which made caption, CAPTCHA, and unavailable-video issues
            // impossible to distinguish.
            console.error("YouTube transcript fetch failed", {
                youtubeId,
                providerMessage,
            });

            throw new TranscriptFetchError(message);
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

        const chunks = this.createChunks(transcript);

        for(const chunk of chunks){
            const embedding = await embeddingService.generateEmbeddings(chunk.content);
            chunk.embedding = embedding;
        }

        await prisma.transcriptChunk.createMany({
            data: chunks.map(chunk => ({
                videoId,
                transcriptId: savedTranscript.id,
                content: chunk.content,
                startTime: chunk.startTime,
                endTime: chunk.endTime,
                chunkIndex: chunk.chunkIndex,
                embedding: chunk.embedding,
            }))
        })
        return savedTranscript;
    }

    private createChunks(transcript : TranscriptSegment[]) : TranscriptChunk[]{

        const chunks : TranscriptChunk[] = [];
        const MAX_TOKENS = 400;
        const OVERLAP_TOKENS = 75;  // Add overlap later (For context in each chunk from the previous chunk)

        let i = 0;

        while(i < transcript.length){
            let currentChunk : TranscriptSegment[] = [];
            let currentToken = 0;

            while(i < transcript.length && currentToken < MAX_TOKENS){
                const segment = transcript[i];
                currentChunk.push(segment);
                currentToken += this.estimateTokens(segment.text);
                i++;
            }
            if(currentChunk.length === 0){ // just incase the transcript is empty
                break;
            }

            const content = currentChunk.map(segment => segment.text).join(" ");
            const startTime = currentChunk[0].startTime;
            const endTime = currentChunk[currentChunk.length - 1].endTime;

            chunks.push({
                content,
                startTime,
                endTime,
                chunkIndex: chunks.length,
                embedding: [],
            })
        }

        return chunks;
    }

    private estimateTokens(text : string) : number {
        const words = text.trim().split(/\s+/).length;
        return Math.ceil(words * 1.3);
    }

    private getUserFacingError(providerMessage: string): string {
        const message = providerMessage.toLowerCase();

        if (message.includes("too many requests") || message.includes("captcha")) {
            return "YouTube is temporarily blocking transcript requests. Please try again later.";
        }

        if (message.includes("disabled") || message.includes("no transcripts")) {
            return "This YouTube video does not provide a transcript or captions.";
        }

        if (message.includes("no longer available") || message.includes("unavailable")) {
            return "This YouTube video is unavailable.";
        }

        return "Unable to fetch this video's transcript from YouTube. Please try another video or try again later.";
    }
}

export default new TranscriptService();
