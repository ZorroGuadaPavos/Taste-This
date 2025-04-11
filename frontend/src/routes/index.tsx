import { ErrorMessage } from "@/components/ErrorMessage";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PlaceDetailsCard } from "@/components/Maps/PlaceDetails";
import { Recommendations } from "@/components/Recommendations/Recommendations";
import { Search } from "@/components/Search";
import { useRestaurantData } from "@/hooks/useRestaurantData";
import { useSearch } from "@/hooks/useSearch";
import { useSelectedPlace } from "@/hooks/useSelectedPlace";
import { Container, VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	const { recommendations, isLoading, errorMessage: dataError, errorType, fetchRestaurantDishes } = useRestaurantData();

	const {
		restaurantQuery,
		setRestaurantQuery,
		searchResults,
		isSearching,
		errorMessage: searchError,
		searchForRestaurants,
		setSearchResults,
	} = useSearch();

	const { selectedPlace, handleRestaurantSelect } = useSelectedPlace(
		fetchRestaurantDishes,
		setRestaurantQuery,
		setSearchResults,
	);

	return (
		<Container maxW="container.xl" py={10} minH="100dvh" display="flex" flexDirection="column">
			<VStack gap={5} align="center" flex="1">
				<Header />
				<Search
					restaurant={restaurantQuery}
					setRestaurant={setRestaurantQuery}
					handleSearch={searchForRestaurants}
					isLoading={isSearching}
					searchResults={searchResults}
					onPlaceSelect={handleRestaurantSelect}
					onClearResults={() => setSearchResults(null)}
				/>
				{selectedPlace && <PlaceDetailsCard place={selectedPlace} />}
				{(dataError || searchError) && (
					<ErrorMessage message={dataError || searchError || "An error occurred"} type={errorType} />
				)}
				<Recommendations isLoading={isLoading} selectedPlace={selectedPlace} recommendations={recommendations} />
			</VStack>
			<Footer />
		</Container>
	);
}
