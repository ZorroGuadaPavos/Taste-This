import type { TextSearchPlace } from "@/services/googleMapsService";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import type { Place } from "./RestaurantPicker";

interface TextSearchResultsProps {
	places: TextSearchPlace[];
	onPlaceSelect: (place: Place) => void;
}

export function TextSearchResults({ places, onPlaceSelect }: TextSearchResultsProps) {
	if (!places || places.length === 0) {
		return (
			<Box
				textAlign="center"
				p={4}
				borderRadius="md"
				bg="white"
				boxShadow="sm"
				borderWidth="1px"
				borderColor="gray.200"
			>
				<Text color="gray.600">No places found. Try a different search restaurant.</Text>
			</Box>
		);
	}

	const handlePlaceSelect = (place: TextSearchPlace) => {
		const selectedPlace: Place = {
			id: place.id || "",
			name: place.name || place.displayName || "",
			displayName: place.displayName || "",
			address: place.formattedAddress || "",
			googleMapsUrl: place.googleMapsUrl,
		};
		onPlaceSelect(selectedPlace);
	};

	return (
		<Box
			w="100%"
			maxW="2xl"
			borderWidth="2px"
			borderRadius="md"
			overflow="hidden"
			bg="white"
			boxShadow="md"
			borderColor="gray.300"
		>
			<Box maxH="350px" overflowY="auto">
				{places.map((place, index) => (
					<Box key={place.id || index}>
						{index > 0 && <Box borderBottomWidth="1px" borderColor="gray.200" />}
						<Button
							variant="ghost"
							justifyContent="flex-start"
							alignItems="center"
							width="100%"
							py={2}
							px={3}
							onClick={() => handlePlaceSelect(place)}
							_hover={{
								bg: "teal.100",
								color: "teal.700",
							}}
							_active={{ bg: "teal.100" }}
							borderRadius={0}
							height="auto"
							minH="unset"
							transition="all 0.2s"
						>
							<Flex align="center" width="100%">
								<Box color="teal.600" mr={2} fontSize="sm">
									<FaMapMarkerAlt />
								</Box>
								<Box textAlign="left">
									<Text fontWeight="medium" color="gray.800" fontSize="sm">
										{place.displayName}
									</Text>
									<Text fontSize="xs" color="gray.600" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
										{place.formattedAddress}
									</Text>
								</Box>
							</Flex>
						</Button>
					</Box>
				))}
			</Box>
		</Box>
	);
}
