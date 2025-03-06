import { JsonOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import settings from "../../core/config.js";
import { scraper } from "../../scraper/index.js";
import { searchPlaceById } from "../../scraper/searchPlaceById.js";
// import { saveResponseData } from "../../utils/saveResponse.js";

const model = new ChatGoogleGenerativeAI({
	model: settings.OPENAI_MODEL,
	apiKey: settings.OPENAI_API_KEY,
	maxOutputTokens: 2048,
});

export async function fetchAndAnalyzePopularDishes(query) {
	const placeUrl = await searchPlaceById(query);
	const reviews = await scraper(placeUrl, { sort_type: "highest_rating", pages: "3", clean: true });
	// saveResponseData({ query, placeUrl, reviewsLength: reviews.length, reviews }, "reviews");

	if (reviews === 0 || reviews.length === 0) {
		return {
			query,
			placeUrl,
			totalReviewsAnalyzed: 0,
			popularDishes: [],
		};
	}

	const filteredReviews = reviews.map(({ review_id, review }) => ({ review_id, review }));
	const result = await analyzePopularDishes(query, filteredReviews);
	return {
		query,
		placeUrl,
		totalReviewsAnalyzed: reviews.length,
		popularDishes: result.popularDishes,
	};
}

export async function analyzePopularDishes(query, reviews) {
	if (!reviews || reviews.length === 0) {
		return { popularDishes: [] };
	}

	const formattedReviews = JSON.stringify(reviews);
	const prompt = settings.POPULAR_DISHES_PROMPT.replace("{query}", query).replace("{reviews}", formattedReviews);

	const parser = new JsonOutputParser();
	const chain = RunnableSequence.from([model, parser]);

	try {
		return await chain.invoke(prompt);
	} catch (error) {
		console.error("Error during analysis:", error.message);
		return { popularDishes: [] };
	}
}
