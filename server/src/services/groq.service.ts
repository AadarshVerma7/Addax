import Groq from "groq-sdk";
import dotevn from "dotenv"
dotevn.config();

class GroqService{
    private groq : Groq;

    constructor(){
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
    }

    async generateResponse(
        messages: Groq.Chat.Completions.ChatCompletionMessageParam[]
    ): Promise<string>{

        const response = await this.groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.4,
        })
        return response.choices[0].message.content ?? "";
    }
}

export default new GroqService();