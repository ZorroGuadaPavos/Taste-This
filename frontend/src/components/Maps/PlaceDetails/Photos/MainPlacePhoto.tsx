import { GoogleMapsConfig } from "@/config/maps";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { Photo } from "./types";

interface MainPlacePhotoProps {
	photo: Photo;
	placeName: string;
	height?: string | object;
	onClick?: () => void;
}

export function MainPlacePhoto({ photo, placeName, height = "100%", onClick }: MainPlacePhotoProps) {
	const [hasError, setHasError] = useState(false);

	const handleImageError = () => {
		setHasError(true);
	};

	if (hasError) {
		return (
			<Flex width="100%" height={height} bg="gray.100" borderRadius="md" justifyContent="center" alignItems="center">
				<Text color="gray.500">Unable to load image</Text>
			</Flex>
		);
	}

	return (
		<Box position="relative" width="100%" height={height} borderRadius="md" overflow="hidden">
			<Image
				src={`https://places.googleapis.com/v1/${photo.name}/media?key=${GoogleMapsConfig.apiKey}&maxHeightPx=400&maxWidthPx=800`}
				alt={`${placeName} photo`}
				objectFit="cover"
				width="100%"
				height="100%"
				borderRadius="md"
				onClick={onClick}
				cursor={onClick ? "pointer" : "default"}
				onError={handleImageError}
			/>
		</Box>
	);
}
