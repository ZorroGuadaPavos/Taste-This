import type { GetRestaurantsResponse } from "@/client";
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
			const result = await getPlaceDetails(placeId);

			if (result.data) {
				setPlaceDetails(result.data.place);
			} else if (result.error) {
				setError(result.error.message);
			}

			setIsLoading(false);
		};

		fetchPlaceDetails();
	}, [placeId]);

	return { placeDetails, isLoading, error };
};

interface ExpandedContentProps {
	placeDetails: PlaceDetails;
	restaurantPhotos: GetRestaurantsResponse;
}

const ExpandedContent = ({ placeDetails, restaurantPhotos }: ExpandedContentProps) => {
	return (
		<Flex direction={{ base: "column", md: "row" }} height="100%" overflow="hidden">
			<Flex flex={{ base: "none", md: 1 }} p={3} align="center" justify="center" height={{ base: "12rem", md: "100%" }}>
				<MainPlacePhoto placeName={placeDetails.displayName} imageUrl={restaurantPhotos.placePhoto || undefined} />
			</Flex>

			<Flex flex={{ base: "auto", md: 1 }} overflow="visible" height="100%">
				<PlaceDetailsContent placeDetails={placeDetails} open={true} />
			</Flex>
		</Flex>
	);
};

interface CollapsedContentProps {
	placeDetails: PlaceDetails;
	selectedPhotoIndex: number;
	onPhotoSelect: (index: number) => void;
	restaurantPhotos: GetRestaurantsResponse;
}

const CollapsedContent = ({
	placeDetails,
	selectedPhotoIndex,
	onPhotoSelect,
	restaurantPhotos,
}: CollapsedContentProps) => {
	return (
		<Box p={3} height="100%">
			<Flex direction="column" gap={2} height="100%">
				<Box flex="1" minHeight="0">
					<MainPlacePhoto
						placeName={placeDetails.displayName}
						imageUrl={restaurantPhotos?.placePhoto || restaurantPhotos?.reviewPhotos?.[selectedPhotoIndex]}
					/>
				</Box>
				<Box height="4rem">
					<PhotoThumbnails
						photos={restaurantPhotos?.reviewPhotos || []}
						placeName={placeDetails.displayName}
						selectedPhotoIndex={selectedPhotoIndex}
						onPhotoSelect={onPhotoSelect}
					/>
				</Box>
			</Flex>
		</Box>
	);
};

interface PlaceDetailsCardProps {
	place: Place;
	restaurantPhotos: GetRestaurantsResponse;
}

function PlaceDetailsCardComponent({ place, restaurantPhotos }: PlaceDetailsCardProps) {
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
					<ExpandedContent placeDetails={placeDetails} restaurantPhotos={restaurantPhotos} />
				) : (
					<CollapsedContent
						placeDetails={placeDetails}
						selectedPhotoIndex={selectedPhotoIndex}
						onPhotoSelect={setSelectedPhotoIndex}
						restaurantPhotos={restaurantPhotos}
					/>
				)}
			</Box>
		</Box>
	);
}

export const PlaceDetailsCard = memo(PlaceDetailsCardComponent, (prevProps, nextProps) => {
	return (
		prevProps.place.id === nextProps.place.id &&
		prevProps.restaurantPhotos?.placeUrlId === nextProps.restaurantPhotos?.placeUrlId
	);
});
