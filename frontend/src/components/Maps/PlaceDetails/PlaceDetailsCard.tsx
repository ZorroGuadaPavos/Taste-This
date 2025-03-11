import { type PlaceDetails, getPlaceDetails } from "@/services/googleMapsService";
import type { Place } from "@/types/Place";
import { Box, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
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
			{/* Header section with restaurant name and rating that is always visible */}
			<PlaceDetailHeader placeDetails={placeDetails} open={open} onToggle={onToggle} />

			{/* Content container with fixed height */}
			<Box
				ref={detailsRef}
				height="auto"
				overflow="hidden"
				transition="height 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
				position="relative"
			>
				<Grid
					templateColumns={open ? { base: "1fr", md: "1fr 1fr" } : "1fr"}
					gap={4}
					transition="all 0.4s ease"
					height="100%"
				>
					{/* Photos column */}
					<GridItem
						order={open ? { base: 2, md: 1 } : 1}
						width="100%"
						transition="all 0.4s ease"
						px={5}
						pb={5}
						pt={open ? 0 : 5}
						display="flex"
						alignItems="center"
					>
						{placeDetails.photos && placeDetails.photos.length > 0 && (
							<Box
								width="100%"
								borderRadius="lg"
								overflow="hidden"
								boxShadow={open ? "sm" : "none"}
								height={open ? { base: "180px", md: "220px" } : "250px"}
							>
								<PlacePhotosGallery photos={placeDetails.photos} placeName={placeDetails.displayName} />
							</Box>
						)}
					</GridItem>

					{/* Details column - only visible when expanded */}
					{open && <PlaceDetailsContent placeDetails={placeDetails} open={open} />}
				</Grid>
			</Box>
		</Box>
	);
}

export const PlaceDetailsCard = memo(PlaceDetailsCardComponent, (prevProps, nextProps) => {
	return prevProps.place.id === nextProps.place.id;
});
