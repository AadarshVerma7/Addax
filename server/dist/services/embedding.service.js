import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
class EmbeddingService {
    async generateEmbeddings(text) {
        const response = await axios.post("https://api.jina.ai/v1/embeddings", {
            model: "jina-embeddings-v3",
            input: [text],
        }, {
            headers: {
                Authorization: `Bearer ${process.env.JINA_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        console.log(response.data);
        return response.data.data[0].embedding;
    }
}
export default new EmbeddingService();
//# sourceMappingURL=embedding.service.js.map