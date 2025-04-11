// import type { TextSearchResponse } from "@/services/googleMapsService";
import type { Place } from "@/types/Place";
import { useCallback, useState } from "react";

export const useSelectedPlace = (
	fetchData: (query: string) => Promise<void>,
	setRestaurantQuery: (value: string) => void,
	setSearchResults: (value: Place[] | null) => void,
) => {
	const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

	const handleRestaurantSelect = useCallback(
		async (place: Place) => {
			setSelectedPlace(place);
			setSearchResults(null);
			setRestaurantQuery(place.name);
			await fetchData(place.id);
		},
		[fetchData, setRestaurantQuery, setSearchResults],
	);

	return {
		selectedPlace,
		handleRestaurantSelect,
	};
};
