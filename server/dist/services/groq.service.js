import Groq from "groq-sdk";
import dotevn from "dotenv";
dotevn.config();
class GroqService {
    groq;
    getClient() {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error("GROQ_API_KEY is not configured. Add it to server/.env before sending chat messages.");
        }
        if (!this.groq) {
            this.groq = new Groq({ apiKey });
        }
        return this.groq;
    }
    async generateResponse(messages) {
        const response = await this.getClient().chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.4,
        });
        return response.choices[0].message.content ?? "";
    }
}
export default new GroqService();
//# sourceMappingURL=groq.service.js.map