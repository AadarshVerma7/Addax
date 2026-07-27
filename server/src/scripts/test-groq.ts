import dotenv from "dotenv";
dotenv.config();

import groqService from "../services/groq.service.js";

async function main() {

    const response = await groqService.generateResponse([
        {
            role: "system",
            content:
                "You are Addax, an AI educator that explains computer science concepts clearly.",
        },
        {
            role: "user",
            content: "Explain Dijkstra's algorithm in two sentences.",
        },
    ]);

    console.log(response);
}

main();