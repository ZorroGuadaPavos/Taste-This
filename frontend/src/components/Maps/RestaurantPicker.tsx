import { PlacePicker } from "@googlemaps/extended-component-library/react";
import "./RestaurantPicker.css";
import { Flex } from "@chakra-ui/react";

export interface Place {
	id: string;
	name: string;
	address: string;
	googleMapsUrl?: string;
}

interface RestaurantPickerProps {
	onRestaurantChange: (place: Place | null) => void;
}

const PlaceData = (googlePlace: google.maps.places.Place): Place => {
	return {
		id: googlePlace.id,
		name: googlePlace.displayName || "",
		address: googlePlace.formattedAddress || "",
		googleMapsUrl: googlePlace.googleMapsURI || undefined,
	};
};

export function RestaurantPicker({ onRestaurantChange }: RestaurantPickerProps) {
	const handlePlaceChange = (e: Event) => {
		try {
			const placePickerElement = e.target as HTMLElement & { value: google.maps.places.Place };
			const place = placePickerElement.value;

			if (place) {
				onRestaurantChange(PlaceData(place));
			} else {
				onRestaurantChange(null);
			}
		} catch (error) {
			console.error("Error processing selected place:", error);
			onRestaurantChange(null);
		}
	};

	return (
		<Flex w="100%" maxW="2xl" direction="column" justifyContent="center" display="flex">
			<PlacePicker
				forMap="gmap"
				type="restaurant"
				placeholder="Enter restaurant name"
				onPlaceChange={handlePlaceChange}
			/>
		</Flex>
	);
}
