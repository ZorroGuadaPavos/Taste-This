import { type PlaceDetails, getPlaceDetails } from "@/services/googleMapsService";
import type { Place } from "@/types/Place";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { memo, useEffect, useRef, useState } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { MainPlacePhoto } from "./Photos/MainPlacePhoto";
import { PhotoThumbnails } from "./Photos/PhotoThumbnails";
import { PlaceDetailHeader } from "./PlaceDetailHeader";
import { PlaceDetailsContent } from "./PlaceDetailsContent";
import { PlaceDetailsSkeleton } from "./PlaceDetailsSkeleton";

const usePlaceDetails = (placeId: string) => {
	const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPlaceDetails = async () => {
			if (!placeId) return;

			setIsLoading(true);
			setError(null);
			try {
				const result = await getPlaceDetails(placeId);
				if (result.data) {
					setPlaceDetails(result.data.place);
				} else if (result.error) {
					setError(result.error.message);
				}
			} catch (err) {
				setError("Failed to fetch place details");
			} finally {
				setIsLoading(false);
			}
		};

		fetchPlaceDetails();
	}, [placeId]);

	return { placeDetails, isLoading, error };
};

const PhotoGallery = memo(
	({
		placeDetails,
		photos,
		selectedIndex,
		onPhotoSelect,
	}: {
		placeDetails: PlaceDetails;
		photos: string[];
		selectedIndex: number;
		onPhotoSelect: (index: number) => void;
	}) => (
		<Box p={3} height="100%">
			<Flex direction="column" gap={2} height="100%">
				<Box flex="1" minHeight="0">
					<MainPlacePhoto placeName={placeDetails.displayName} imageUrl={photos[selectedIndex] || ""} />
				</Box>
				<Box height="4rem">
					<PhotoThumbnails
						photos={photos}
						placeName={placeDetails.displayName}
						selectedPhotoIndex={selectedIndex}
						onPhotoSelect={onPhotoSelect}
					/>
				</Box>
			</Flex>
		</Box>
	),
);

const ExpandedView = memo(
	({
		placeDetails,
		photos,
	}: {
		placeDetails: PlaceDetails;
		photos: string[];
	}) => (
		<Flex direction={{ base: "column", md: "row" }} height="100%" overflow="hidden">
			<Flex flex={{ base: "none", md: 1 }} p={3} align="center" justify="center" height={{ base: "12rem", md: "100%" }}>
				<MainPlacePhoto placeName={placeDetails.displayName} imageUrl={photos[0] || undefined} />
			</Flex>
			<Flex flex={{ base: "auto", md: 1 }} overflow="visible" height="100%">
				<PlaceDetailsContent placeDetails={placeDetails} open={true} />
			</Flex>
		</Flex>
	),
);

function PlaceDetailsCardComponent({
	place,
	photos,
}: {
	place: Place;
	photos: string[];
}) {
	const { placeDetails, isLoading, error } = usePlaceDetails(place.id);
	const { open, onToggle } = useDisclosure({ defaultOpen: false });
	const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
	const detailsRef = useRef<HTMLDivElement>(null);

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
					<ExpandedView placeDetails={placeDetails} photos={photos} />
				) : (
					<PhotoGallery
						placeDetails={placeDetails}
						photos={photos}
						selectedIndex={selectedPhotoIndex}
						onPhotoSelect={setSelectedPhotoIndex}
					/>
				)}
			</Box>
		</Box>
	);
}

export const PlaceDetailsCard = memo(PlaceDetailsCardComponent, (prevProps, nextProps) => {
	return (
		prevProps.place.id === nextProps.place.id &&
		prevProps.photos.length === nextProps.photos.length &&
		prevProps.photos.every((photo, index) => photo === nextProps.photos[index])
	);
});
