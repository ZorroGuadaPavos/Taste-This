import type { TextSearchResponse } from "@/services/googleMapsService";
import { searchPlacesByText } from "@/services/googleMapsService";
import { useCallback, useState } from "react";

export const useSearch = () => {
	const [restaurant, setRestaurant] = useState("");
	const [textSearchResults, setTextSearchResults] = useState<TextSearchResponse | null>(null);
	const [isTextSearching, setIsTextSearching] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const searchForRestaurants = useCallback(async () => {
		if (!restaurant.trim()) return;

		setIsTextSearching(true);
		setTextSearchResults(null);
		setErrorMessage(null);

		try {
			const result = await searchPlacesByText(restaurant);
			if (result.data) {
				setTextSearchResults(result.data);
			} else if (result.error) {
				setErrorMessage(result.error.message);
			}
		} catch (error) {
			setErrorMessage("Failed to search for restaurants");
		} finally {
			setIsTextSearching(false);
		}
	}, [restaurant]);

	return {
		restaurant,
		setRestaurant,
		textSearchResults,
		isTextSearching,
		errorMessage,
		searchForRestaurants,
		setTextSearchResults,
	};
};
