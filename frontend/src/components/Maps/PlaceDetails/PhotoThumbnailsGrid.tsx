import { GoogleMapsConfig } from "@/config/maps";
import { Box, Flex, Image } from "@chakra-ui/react";
import type { Photo } from "./PlacePhotosGallery";

interface PhotoThumbnailsGridProps {
	photos: Photo[];
	placeName: string;
	onThumbnailClick: (index: number) => void;
	maxThumbnails?: number;
	showMoreIndicator?: boolean;
}

export function PhotoThumbnailsGrid({
	photos,
	placeName,
	onThumbnailClick,
	maxThumbnails = 3,
	showMoreIndicator = false,
}: PhotoThumbnailsGridProps) {
	if (photos.length <= 1) {
		return null;
	}

	const thumbnailPhotos = photos.slice(1, maxThumbnails + 1);

	return (
		<Flex gap={2} transition="all 0.3s ease-in-out" width="100%" height="4rem">
			{thumbnailPhotos.map((photo, index) => (
				<Box
					key={photo.name}
					position="relative"
					height="4rem"
					borderRadius="md"
					overflow="hidden"
					transition="all 0.2s"
					cursor="pointer"
					onClick={() => onThumbnailClick(index + 1)}
					flex={1}
					_hover={{
						transform: "scale(1.05)",
						boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
					}}
					title={`View photo ${index + 2}`}
				>
					<Image
						src={`https://places.googleapis.com/v1/${photo.name}/media?key=${GoogleMapsConfig.apiKey}&maxHeightPx=100&maxWidthPx=100`}
						alt={`${placeName} - photo ${index + 2}`}
						objectFit="cover"
						width="100%"
						height="100%"
						borderRadius="md"
						loading="lazy"
					/>
				</Box>
			))}

			{showMoreIndicator && photos.length > maxThumbnails + 1 && (
				<Box
					position="relative"
					height="4rem"
					borderRadius="md"
					overflow="hidden"
					flex={1}
					bg="gray.600"
					color="white"
					display="flex"
					alignItems="center"
					justifyContent="center"
					fontWeight="bold"
				>
					+{photos.length - (maxThumbnails + 1)}
				</Box>
			)}
		</Flex>
	);
}
