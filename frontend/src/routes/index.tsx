import type { GetAnalysisResponse } from "@/client";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Header } from "@/components/Header";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { RestaurantOverview } from "@/components/Maps/RestaurantOverview";
import { type Place, RestaurantPicker } from "@/components/Maps/RestaurantPicker";
import { RecommendationsList } from "@/components/RecommendationsList";
import { GoogleMapsConfig } from "@/config/maps";
import { searchRestaurant } from "@/services/restaurantService";
import { Container, VStack } from "@chakra-ui/react";
import { APILoader } from "@googlemaps/extended-component-library/react";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [recommendations, setRecommendations] = useState<GetAnalysisResponse | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [errorType, setErrorType] = useState<"notFound" | "error">("error");

	const handleSearch = useCallback(async (searchQuery: string) => {
		if (!searchQuery) return;

		setIsLoading(true);
		setErrorMessage(null);

		const result = await searchRestaurant(searchQuery);

		if (result.data) {
			setRecommendations(result.data);
		} else if (result.error) {
			setErrorType(result.error.type);
			setErrorMessage(result.error.message);
			setRecommendations(null);
		}
		setIsLoading(false);
	}, []);

	const handleRestaurantChange = useCallback(
		async (place: Place | null) => {
			if (!place) {
				setSelectedPlace(null);
				return;
			}

			setSelectedPlace(place);
			const cid = place.googleMapsUrl?.split("cid=")[1];
			if (cid) {
				await handleSearch(cid);
			} else {
				await handleSearch(place.name);
			}
		},
		[handleSearch],
	);

	return (
		<Container maxW="container.xl" py={10}>
			<APILoader apiKey={GoogleMapsConfig.apiKey} solutionChannel={GoogleMapsConfig.solutionChannel} />
			<VStack gap={8} align="center">
				<Header />
				<RestaurantPicker onRestaurantChange={handleRestaurantChange} />
				{selectedPlace && <RestaurantOverview place={selectedPlace} />}
				{errorMessage && <ErrorMessage message={errorMessage} type={errorType} />}
				{isLoading ? (
					<LoadingIndicator />
				) : selectedPlace && recommendations ? (
					<RecommendationsList recommendations={recommendations} place={selectedPlace} />
				) : null}
			</VStack>
		</Container>
	);
}
