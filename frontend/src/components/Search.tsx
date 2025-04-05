// import type { TextSearchPlace } from "@/services/googleMapsService";
import type { Place } from "@/types/Place";
import { Box } from "@chakra-ui/react";
import { SearchResultsOverlay } from "./Maps/SearchResultsOverlay";
import { SearchBar } from "./SearchBar";

interface SearchProps {
	restaurant: string;
	setRestaurant: (value: string) => void;
	handleSearch: () => void;
	isLoading: boolean;
	searchResults: Place[] | null;
	onPlaceSelect: (place: Place) => void;
	onClearResults: () => void;
}

export function Search({
	restaurant,
	setRestaurant,
	handleSearch,
	isLoading,
	searchResults,
	onPlaceSelect,
	onClearResults,
}: SearchProps) {
	return (
		<Box w="100%" maxW="2xl" position="relative" zIndex="2">
			<SearchBar
				restaurant={restaurant}
				setRestaurant={setRestaurant}
				handleSearch={handleSearch}
				isLoading={isLoading}
			/>
			{searchResults && searchResults.length > 0 && (
				<SearchResultsOverlay places={searchResults} onPlaceSelect={onPlaceSelect} onClose={onClearResults} />
			)}
		</Box>
	);
}
