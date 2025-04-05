import type { Place } from "@/types/Place";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { memo, useState } from "react";
import { MainPlacePhoto } from "./Photos/MainPlacePhoto";
import { PhotoThumbnails } from "./Photos/PhotoThumbnails";
import { PlaceDetailHeader } from "./PlaceDetailHeader";
import { PlaceDetailsContent } from "./PlaceDetailsContent";

interface PlaceDetailsCardProps {
	place: Place;
}

export const PlaceDetailsCard = memo(({ place }: PlaceDetailsCardProps) => {
	const disclosure = useDisclosure({ defaultOpen: false });
	const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

	if (!place) {
		return null;
	}

	const photos = place.photos || [];
	const mainPhotoUrl = photos[selectedPhotoIndex] || photos[0];

	const open = disclosure.open;

	return (
		<Box
			w="100%"
			maxW="2xl"
			borderWidth="1px"
			borderRadius="xl"
			overflow="hidden"
			bg="bg.box"
			boxShadow="lg"
			borderColor="bg.200"
			transition="all 0.3s ease"
			position="relative"
		>
			<PlaceDetailHeader place={place} open={open} onToggle={disclosure.onToggle} />

			<Box height={{ base: "auto", md: "20rem" }} overflow="hidden" position="relative">
				{open ? (
					<Flex direction={{ base: "column", md: "row" }} height="100%" overflow="hidden">
						<Flex
							flex={{ base: "none", md: 1 }}
							p={3}
							align="center"
							justify="center"
							height={{ base: "12rem", md: "100%" }}
						>
							<MainPlacePhoto placeName={place.name} imageUrl={photos[0]} />
						</Flex>
						<Flex flex={{ base: "auto", md: 1 }} overflow="visible" height="100%">
							<PlaceDetailsContent place={place} open={open} />
						</Flex>
					</Flex>
				) : (
					<Box p={3} height="100%">
						<Flex direction="column" gap={2} height="100%">
							<Box flex="1" minHeight="0">
								<MainPlacePhoto placeName={place.name} imageUrl={mainPhotoUrl} />
							</Box>
							{photos.length > 1 && (
								<Box height="4rem">
									<PhotoThumbnails
										photos={photos}
										placeName={place.name}
										selectedPhotoIndex={selectedPhotoIndex}
										onPhotoSelect={setSelectedPhotoIndex}
									/>
								</Box>
							)}
						</Flex>
					</Box>
				)}
			</Box>
		</Box>
	);
});

PlaceDetailsCard.displayName = "PlaceDetailsCard";
