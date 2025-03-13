import { GoogleMapsConfig } from "@/config/maps";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { Photo } from "./types";

interface PhotoThumbnailsProps {
	photos: Photo[];
	placeName: string;
	onPhotoSelect: (index: number) => void;
	selectedPhotoIndex?: number;
	maxThumbnails?: number;
	showMoreIndicator?: boolean;
}

export function PhotoThumbnails({
	photos,
	placeName,
	onPhotoSelect,
	selectedPhotoIndex = 0,
	maxThumbnails = 6,
}: PhotoThumbnailsProps) {
	if (!photos || photos.length <= 1) {
		return null;
	}

	const thumbnailPhotos = photos.slice(0, maxThumbnails);
	const [hasError, setHasError] = useState(false);

	const handleImageError = () => {
		setHasError(true);
	};

	if (hasError) {
		return (
			<Flex width="100%" bg="gray.100" borderRadius="md" justifyContent="center" alignItems="center">
				<Text color="gray.500">Unable to load image</Text>
			</Flex>
		);
	}

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
					onClick={() => onPhotoSelect(index)}
					flex={1}
					border={selectedPhotoIndex === index ? "2px solid" : "none"}
					borderColor="accent.lavender"
					_hover={{
						transform: "scale(1.05)",
						boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
					}}
					title={`View photo ${index + 1}`}
				>
					<Image
						src={`https://places.googleapis.com/v1/${photo.name}/media?key=${GoogleMapsConfig.apiKey}&maxHeightPx=100&maxWidthPx=100`}
						alt={`${placeName} - photo ${index + 1}`}
						objectFit="cover"
						width="100%"
						height="100%"
						borderRadius="md"
						loading="lazy"
						onError={handleImageError}
					/>
				</Box>
			))}
		</Flex>
	);
}
