import settings from "../../core/config.js";
import { popularDishesResponseSchema } from "./schemas.js";

export function getPopularDishesModelConfig(modelName) {
	return {
		model: modelName,
		generationConfig: {
			temperature: 0.1,
			topP: 0.2,
			topK: 40,
			maxOutputTokens: 2048,
			responseMimeType: "application/json",
			responseSchema: popularDishesResponseSchema,
		},
		systemInstruction: settings.POPULAR_DISHES_PROMPT,
	};
}
