import type { GetAnalysisResponse } from "@/client";
import { AnalysisService } from "@/client";

interface SearchResult {
	data?: GetAnalysisResponse;
	error?: {
		type: "notFound" | "error";
		message: string;
	};
}

export async function searchRestaurant(restaurantName: string): Promise<SearchResult> {
	try {
		if (!restaurantName.trim()) {
			return {
				error: {
					type: "error",
					message: "Please enter a restaurant name",
				},
			};
		}
		const response = await AnalysisService.getAnalysis({ query: restaurantName });
		return { data: response };
	} catch (error) {
		console.error("Error searching for restaurant:", error);
		return {
			error: {
				type: "error",
				message: "An error occurred while searching. Please try again later.",
			},
		};
	}
}
