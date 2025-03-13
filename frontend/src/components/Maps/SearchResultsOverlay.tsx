import type { TextSearchPlace } from "@/services/googleMapsService";
import type { Place } from "@/types/Place";
import { Box } from "@chakra-ui/react";
import { TextSearchResults } from "./TextSearchResults";

interface SearchResultsOverlayProps {
	places: TextSearchPlace[];
	onPlaceSelect: (place: Place) => void;
	onClose: () => void;
}

export const SearchResultsOverlay = ({ places, onPlaceSelect, onClose }: SearchResultsOverlayProps) => {
	return (
		<>
			<Box position="fixed" top="0" left="0" right="0" bottom="0" bg="blackAlpha.300" zIndex="5" onClick={onClose} />
			<Box position="absolute" top="100%" left="0" width="100%" mt={2} zIndex="10">
				<TextSearchResults places={places} onPlaceSelect={onPlaceSelect} />
			</Box>
		</>
	);
};
