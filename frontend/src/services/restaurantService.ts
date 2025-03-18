import type { GetRestaurantsDishesResponse, GetRestaurantsResponse } from "@/client";
import { RestaurantsService } from "@/client";

interface SearchResult {
	data?: GetRestaurantsDishesResponse;
	error?: {
		type: "notFound" | "error";
		message: string;
	};
}

export interface RestaurantResult {
	data?: GetRestaurantsResponse;
	error?: {
		type: "notFound" | "error";
		message: string;
	};
}

export async function getRestaurantInfo(query: string): Promise<RestaurantResult> {
	try {
		if (!query.trim()) {
			return {
				error: {
					type: "error",
					message: "Please enter a restaurant name",
				},
			};
		}
		const response = await RestaurantsService.getRestaurants({ query });
		return { data: response };
	} catch (error) {
		console.error("Error getting restaurant:", error);
		return {
			error: {
				type: "error",
				message: "An error occurred while searching. Please try again later.",
			},
		};
	}
}

export async function getRestaurantDishes(placeUrl: string): Promise<SearchResult> {
	try {
		if (!placeUrl.trim()) {
			return {
				error: {
					type: "error",
					message: "Invalid restaurant URL",
				},
			};
		}
		const response = await RestaurantsService.getRestaurantsDishes({ query: placeUrl });
		return { data: response };
	} catch (error) {
		console.error("Error getting restaurant dishes:", error);
		return {
			error: {
				type: "error",
				message: "An error occurred while fetching dishes. Please try again later.",
			},
		};
	}
}

// Legacy function - will be removed
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
		const response = await RestaurantsService.getRestaurantsDishes({ query: restaurantName });
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
