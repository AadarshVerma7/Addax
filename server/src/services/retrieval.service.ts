import embeddingService from "./embedding.service.js";
import { RetrievalChunk } from "../types/retrieval.types.js";
import prisma from "../lib/prisma.js";

class RetrievalService {
    async retrieveRelevantChunks(question: string, topK: number = 5): Promise<RetrievalChunk[]> {

        const queryEmbeddings = await embeddingService.generateEmbeddings(question);

        const result = await prisma.$runCommandRaw({
            aggregate: "TranscriptChunk",
            pipeline: [
                {
                    $vectorSearch: {
                        index: "vector_index",
                        path: "embedding",
                        queryVector: queryEmbeddings,
                        numCandidates: 100,
                        limit: topK,
                    },
                },
                {
                    $project: {
                        content: 1,
                        startTime: 1,
                        endTime: 1,
                        score: {
                            $meta: "vectorSearchScore",
                        },
                    },
                },
            ],
            cursor: {},
        })

        // console.log(result);
        // console.log(result.cursor.firstBatch);

        const chunks = result.cursor.firstBatch as RetrievalChunk[];
        return chunks;
    }
}

export default new RetrievalService();