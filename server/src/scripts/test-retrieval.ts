import dotenv from "dotenv";
dotenv.config();

import retrievalService from "../services/retrieval.service.js";

async function main() {
    const chunks = await retrievalService.retrieveRelevantChunks(
        "Why is Dijkstra's algorithm greedy?"
    );

    console.log(chunks);
}

main();