import dotenv from "dotenv";
dotenv.config();

import embeddingService from "../services/embedding.service.js";

async function main() {
    try {
        console.log("Generating embedding...\n");

        const embedding = await embeddingService.generateEmbeddings(
            "What is Depth First Search?"
        );

        console.log("\nEmbedding generated successfully!");
        console.log("------------------------------------");

        // Print only the first few values
        console.log("First 10 values:");
        console.log(embedding.slice(0, 10));

        console.log("------------------------------------");
        console.log(`Embedding Dimension: ${embedding.length}`);

    } catch (error) {
        console.error("Error generating embedding:", error);
    }
}

main();