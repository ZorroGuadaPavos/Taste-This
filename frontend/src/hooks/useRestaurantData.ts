import type { GetRestaurantsDishesResponse } from "@/client";
import { RestaurantsService } from "@/client";
import { getRecaptchaToken } from "@/utils/recaptchaUtils";
import { useCallback, useState } from "react";

export const useRestaurantData = () => {
	const [recommendations, setRecommendations] = useState<GetRestaurantsDishesResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [errorType, setErrorType] = useState<"notFound" | "error">("error");

	const fetchRestaurantDishes = useCallback(async (placeId: string) => {
		if (!placeId) return;

		setIsLoading(true);
		setRecommendations(null);
		setErrorMessage(null);
		setErrorType("error");

		try {
			const recaptchaToken = await getRecaptchaToken("select_restaurant");

			const dishesResult = await RestaurantsService.getRestaurantsDishes({
				query: placeId,
				xRecaptchaToken: recaptchaToken,
			});

			if (dishesResult.success && dishesResult.popularDishes) {
				setRecommendations(dishesResult);
			} else {
				const backendError = (dishesResult as any).error;
				setErrorMessage(backendError || "Failed to retrieve dishes or no dishes found.");
				setRecommendations(null);
			}
		} catch (error: any) {
			if (error.message?.includes("reCAPTCHA")) {
				setErrorMessage("Could not verify request. Please try again.");
			} else {
				console.error("Error fetching restaurant dishes:", error);
				const apiErrorMessage = error?.body?.message || error?.message;
				setErrorMessage(apiErrorMessage || "An unexpected error occurred while fetching dishes.");
			}
			setRecommendations(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		recommendations,
		isLoading,
		errorMessage,
		errorType,
		fetchRestaurantDishes,
	};
};
