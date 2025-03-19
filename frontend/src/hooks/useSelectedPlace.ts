import type { TextSearchResponse } from "@/services/googleMapsService";
import type { Place } from "@/types/Place";
import { useCallback, useState } from "react";

export const useSelectedPlace = (
	fetchData: (query: string) => Promise<void>,
	setRestaurant: (value: string) => void,
	setTextSearchResults: (value: TextSearchResponse | null) => void,
) => {
	const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

	const handleRestaurantSelect = useCallback(
		async (place: Place) => {
			setSelectedPlace(place);
			setTextSearchResults(null);
			setRestaurant(place.name);
			const cid = place.googleMapsUrl?.split("cid=")[1];
			await fetchData(cid || place.name);
		},
		[fetchData, setRestaurant, setTextSearchResults],
	);

	return {
		selectedPlace,
		handleRestaurantSelect,
	};
};
