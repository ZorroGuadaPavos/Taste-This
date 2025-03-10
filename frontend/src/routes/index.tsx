import type { GetAnalysisResponse } from "@/client";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Header } from "@/components/Header";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { PlaceDetailsCard } from "@/components/Maps/PlaceDetailsCard";
import { RestaurantOverview } from "@/components/Maps/RestaurantOverview";
import type { Place } from "@/components/Maps/RestaurantPicker";
import { RecommendationsList } from "@/components/RecommendationsList";
import { Search } from "@/components/Search";
import { GoogleMapsConfig } from "@/config/maps";
import { type TextSearchResponse, searchPlacesByText } from "@/services/googleMapsService";
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
	const [restaurant, setRestaurant] = useState("");
	const [textSearchResults, setTextSearchResults] = useState<TextSearchResponse | null>(null);
	const [isTextSearching, setIsTextSearching] = useState(false);

	const searchForRestaurants = useCallback(async () => {
		if (!restaurant.trim()) return;

		setIsTextSearching(true);
		setTextSearchResults(null);
		setErrorMessage(null);
		const result = await searchPlacesByText(restaurant);

		if (result.data) {
			setTextSearchResults(result.data);
		} else if (result.error) {
			setErrorType("error");
			setErrorMessage(result.error.message);
		}
		setIsTextSearching(false);
	}, [restaurant]);

	const fetchRecommendations = useCallback(async (searchQuery: string) => {
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

	const handleRestaurantSelect = useCallback(
		async (place: Place) => {
			setSelectedPlace(place);
			setTextSearchResults(null);
			setRestaurant(place.name);
			const cid = place.googleMapsUrl?.split("cid=")[1];
			cid ? await fetchRecommendations(cid) : await fetchRecommendations(place.name);
			// return null
		},
		[fetchRecommendations],
	);

	const renderRecommendations = () => {
		if (isLoading) return <LoadingIndicator />;
		if (selectedPlace && recommendations)
			return <RecommendationsList recommendations={recommendations} place={selectedPlace} />;
	};

	return (
		<Container maxW="container.xl" py={10}>
			<APILoader apiKey={GoogleMapsConfig.apiKey} solutionChannel={GoogleMapsConfig.solutionChannel} />
			<VStack gap={8} align="center">
				<Header />
				<Search
					restaurant={restaurant}
					setRestaurant={setRestaurant}
					handleSearch={searchForRestaurants}
					isLoading={isTextSearching}
					textSearchResults={textSearchResults}
					onPlaceSelect={handleRestaurantSelect}
					onClearResults={() => setTextSearchResults(null)}
				/>
				{selectedPlace && <PlaceDetailsCard place={selectedPlace} />}
				{errorMessage && <ErrorMessage message={errorMessage} type={errorType} />}
				{renderRecommendations()}
			</VStack>
		</Container>
	);
}
