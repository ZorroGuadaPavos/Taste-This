import { type GetRestaurantsResponse, RestaurantsService } from "@/client";
import type { Place } from "@/types/Place";
import { getRecaptchaToken } from "@/utils/recaptchaUtils";
import { useCallback, useState } from "react";

const transformBackendRestaurantToPlace = (restaurant: GetRestaurantsResponse["restaurants"][number]): Place | null => {
	if (!restaurant.id || !restaurant.name || !restaurant.address) {
		console.warn("Skipping restaurant with missing id, name, or address:", restaurant);
		return null;
	}
	return {
		id: restaurant.id,
		name: restaurant.name,
		address: restaurant.address,
		rating: restaurant.rating ?? null,
		reviewCount: restaurant.reviewCount ?? null,
		categories: restaurant.categories ?? null,
		priceLevel: restaurant.priceLevel ?? null,
		openNow: restaurant.openNow ?? false,
		phone: restaurant.phone ?? null,
		website: restaurant.website ?? null,
		photos: restaurant.photos ?? [],
		accessibility: restaurant.accessibility ?? null,
	};
};

export const useSearch = () => {
	const [restaurantQuery, setRestaurantQuery] = useState("");
	const [searchResults, setSearchResults] = useState<Place[] | null>(null);
	const [isSearching, setIsSearching] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const searchForRestaurants = useCallback(async () => {
		if (!restaurantQuery.trim()) return;

		setIsSearching(true);
		setSearchResults(null);
		setErrorMessage(null);

		try {
			const recaptchaToken = await getRecaptchaToken("search_restaurants");

			const response = await RestaurantsService.getRestaurants({
				query: restaurantQuery,
				xRecaptchaToken: recaptchaToken,
			});

			if (response.success && response.restaurants) {
				const places = response.restaurants
					.map(transformBackendRestaurantToPlace)
					.filter((place): place is Place => place !== null);
				setSearchResults(places);
			} else {
				setErrorMessage(response.error || "No restaurants found.");
				setSearchResults([]);
			}
		} catch (error: any) {
			if (error.message?.includes("reCAPTCHA")) {
				setErrorMessage("Could not verify request. Please try again.");
			} else {
				console.error("Error searching restaurants:", error);
				setErrorMessage(error?.message || "An unexpected error occurred during search.");
			}
			setSearchResults(null);
		} finally {
			setIsSearching(false);
		}
	}, [restaurantQuery]);

	return {
		restaurantQuery,
		setRestaurantQuery,
		searchResults,
		isSearching,
		errorMessage,
		searchForRestaurants,
		setSearchResults,
	};
};
