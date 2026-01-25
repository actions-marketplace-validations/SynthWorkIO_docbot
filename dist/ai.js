"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWithAI = generateWithAI;
exports.hasAICapability = hasAICapability;
const openai_1 = __importDefault(require("openai"));
let openaiClient = null;
function getClient() {
    if (!openaiClient) {
        const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new Error('No AI API key available. Set OPENAI_API_KEY or OPENROUTER_API_KEY.');
        }
        openaiClient = new openai_1.default({
            apiKey,
            baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
        });
    }
    return openaiClient;
}
async function generateWithAI(prompt, model = 'gpt-3.5-turbo') {
    const client = getClient();
    try {
        const response = await client.chat.completions.create({
            model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a technical documentation expert. Generate clear, concise, developer-friendly documentation in Markdown format.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 2000,
        });
        return response.choices[0]?.message?.content || '';
    }
    catch (error) {
        console.error('AI generation failed:', error);
        throw error;
    }
}
function hasAICapability() {
    return !!(process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY);
}
