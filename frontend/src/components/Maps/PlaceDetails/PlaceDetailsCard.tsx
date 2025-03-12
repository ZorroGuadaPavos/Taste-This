import { type PlaceDetails, getPlaceDetails } from "@/services/googleMapsService";
import type { Place } from "@/types/Place";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { memo, useEffect, useRef, useState } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { PlaceDetailHeader } from "./PlaceDetailHeader";
import { PlaceDetailsContent } from "./PlaceDetailsContent";
import { PlaceDetailsSkeleton } from "./PlaceDetailsSkeleton";
import { PlacePhotosGallery } from "./PlacePhotosGallery";

function PlaceDetailsCardComponent({ place }: { place: Place }) {
	const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { open, onToggle } = useDisclosure({ defaultOpen: false });
	const detailsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchPlaceDetails = async () => {
			if (!place.id) return;

			setIsLoading(true);
			setError(null);
			const result = await getPlaceDetails(place.id);

			if (result.data) {
				setPlaceDetails(result.data.place);
			} else if (result.error) {
				setError(result.error.message);
			}

			setIsLoading(false);
		};

		fetchPlaceDetails();
	}, [place.id]);

	if (isLoading) return <PlaceDetailsSkeleton />;

	if (error) return <ErrorMessage message={error} />;

	if (!placeDetails) return null;

	return (
		<Box
			w="100%"
			maxW="2xl"
			borderWidth="1px"
			borderRadius="xl"
			overflow="hidden"
			borderColor="bg.200"
			bg="bg.box"
			boxShadow="sm"
			transition="all 0.3s ease"
			position="relative"
		>
			<PlaceDetailHeader placeDetails={placeDetails} open={open} onToggle={onToggle} />

			<Box ref={detailsRef} height={{ base: "auto", md: "20rem" }} overflow="hidden" position="relative">
				{open ? (
					// Open state: Simple two-column layout with photo on left, details on right
					<Flex direction={{ base: "column", md: "row" }} height="100%" overflow="hidden">
						<Flex
							flex={{ base: "none", md: 1 }}
							p={3}
							align="center"
							justify="center"
							height={{ base: "12rem", md: "100%" }}
							minWidth={{ md: "45%" }}
							maxWidth={{ md: "50%" }}
						>
							{placeDetails.photos && placeDetails.photos.length > 0 && (
								<Box width="100%" borderRadius="lg" overflow="hidden" height="100%">
									<PlacePhotosGallery photos={placeDetails.photos} placeName={placeDetails.displayName} isOpen={true} />
								</Box>
							)}
						</Flex>

						<Flex flex={{ base: "auto", md: 1 }} overflow="visible" height="100%">
							<PlaceDetailsContent placeDetails={placeDetails} open={open} />
						</Flex>
					</Flex>
				) : (
					// Closed state: Show the full gallery layout
					<Box p={3} height="100%">
						{placeDetails.photos && placeDetails.photos.length > 0 && (
							<Box width="100%" height="100%" borderRadius="lg" overflow="hidden">
								<PlacePhotosGallery photos={placeDetails.photos} placeName={placeDetails.displayName} isOpen={false} />
							</Box>
						)}
					</Box>
				)}
			</Box>
		</Box>
	);
}

export const PlaceDetailsCard = memo(PlaceDetailsCardComponent, (prevProps, nextProps) => {
	return prevProps.place.id === nextProps.place.id;
});
