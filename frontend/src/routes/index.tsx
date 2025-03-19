import { ErrorMessage } from "@/components/ErrorMessage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PlaceDetailsCard } from "@/components/Maps/PlaceDetails";
import { Recommendations } from "@/components/Recommendations/Recommendations";
import { Search } from "@/components/Search";
import { GoogleMapsConfig } from "@/config/maps";
import { useRestaurantData } from "@/hooks/useRestaurantData";
import { useSearch } from "@/hooks/useSearch";
import { useSelectedPlace } from "@/hooks/useSelectedPlace";
import { Container, VStack } from "@chakra-ui/react";
import { APILoader } from "@googlemaps/extended-component-library/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	const { recommendations, photos, isLoading, errorMessage: dataError, errorType, fetchData } = useRestaurantData();

	const {
		restaurant,
		setRestaurant,
		textSearchResults,
		isTextSearching,
		errorMessage: searchError,
		searchForRestaurants,
		setTextSearchResults,
	} = useSearch();

	const { selectedPlace, handleRestaurantSelect } = useSelectedPlace(fetchData, setRestaurant, setTextSearchResults);

	return (
		<Container maxW="container.xl" py={10} minH="100dvh" display="flex" flexDirection="column">
			<APILoader apiKey={GoogleMapsConfig.apiKey} solutionChannel={GoogleMapsConfig.solutionChannel} />
			<VStack gap={5} align="center" flex="1">
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
				{selectedPlace && <PlaceDetailsCard place={selectedPlace} photos={photos} />}
				{(dataError || searchError) && (
					<ErrorMessage message={dataError || searchError || "An error occurred"} type={errorType} />
				)}
				<Recommendations isLoading={isLoading} selectedPlace={selectedPlace} recommendations={recommendations} />
			</VStack>
			<Footer />
		</Container>
	);
}
