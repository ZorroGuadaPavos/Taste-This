import type { GetRestaurantsDishesResponse } from "@/client";
import { getRestaurantDishes, getRestaurantInfo } from "@/services/restaurantService";
import { useCallback, useState } from "react";

export const useRestaurantData = () => {
	const [recommendations, setRecommendations] = useState<GetRestaurantsDishesResponse | null>(null);
	const [photos, setPhotos] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [errorType, setErrorType] = useState<"notFound" | "error">("error");

	const fetchData = useCallback(async (searchQuery: string) => {
		if (!searchQuery) return;

		setIsLoading(true);
		setErrorMessage(null);

		try {
			const restaurantResult = await getRestaurantInfo(searchQuery);

			if (restaurantResult.error) {
				setErrorType(restaurantResult.error.type);
				setErrorMessage(restaurantResult.error.message);
				setRecommendations(null);
				setPhotos([]);
				return;
			}

			if (restaurantResult.data) {
				const newPhotos = [
					...(restaurantResult.data.placePhoto ? [restaurantResult.data.placePhoto] : []),
					...(restaurantResult.data.reviewPhotos || []),
				];
				setPhotos(newPhotos);

				const dishesResult = await getRestaurantDishes(restaurantResult.data.placeUrlId);

				if (dishesResult.data) {
					setRecommendations(dishesResult.data);
				} else if (dishesResult.error) {
					setErrorType(dishesResult.error.type);
					setErrorMessage(dishesResult.error.message);
					setRecommendations(null);
				}
			}
		} catch (error) {
			setErrorType("error");
			setErrorMessage("Failed to fetch restaurant data");
			setPhotos([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		recommendations,
		photos,
		isLoading,
		errorMessage,
		errorType,
		fetchData,
	};
};
