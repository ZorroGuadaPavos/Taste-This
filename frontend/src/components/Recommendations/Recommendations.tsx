import type { GetRestaurantsDishesResponse } from "@/client";
import { LoaderReviews } from "@/components/LoaderReviews";
import { RecommendationsList } from "@/components/RecommendationsList";
import type { Place } from "@/types/Place";
import { memo } from "react";

export const Recommendations = memo(
	({
		isLoading,
		selectedPlace,
		recommendations,
	}: { isLoading: boolean; selectedPlace: Place | null; recommendations: GetRestaurantsDishesResponse | null }) => {
		if (isLoading) return <LoaderReviews />;
		if (selectedPlace && recommendations) {
			return <RecommendationsList recommendations={recommendations} place={selectedPlace} />;
		}
		return null;
	},
);
