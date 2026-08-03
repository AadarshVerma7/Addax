import dotenv from "dotenv";
dotenv.config();
import retrievalService from "../services/retrieval.service.js";
async function main() {
    const chunks = await retrievalService.retrieveRelevantChunks("6a66db08c694bec9bf9ad704", "What is System Design");
    console.log(chunks);
}
main();
//# sourceMappingURL=test-retrieval.js.map