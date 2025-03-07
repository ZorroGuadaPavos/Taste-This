import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiModel {
	constructor(model, apiKey) {
		this.model = model;
		this.apiKey = apiKey;
		this.genAI = new GoogleGenerativeAI(apiKey);
	}

	async runModel(modelConfig, prompt) {
		const model = this.genAI.getGenerativeModel(modelConfig);
		const chatSession = model.startChat({ history: [] });
		const result = await chatSession.sendMessage(prompt);
		return result.response.text();
	}
}
