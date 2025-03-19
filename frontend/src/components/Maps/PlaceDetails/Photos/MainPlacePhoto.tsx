import { Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { useState } from "react";

interface MainPlacePhotoProps {
	placeName: string;
	height?: string | object;
	onClick?: () => void;
	imageUrl?: string;
}

export function MainPlacePhoto({ placeName, height = "100%", onClick, imageUrl }: MainPlacePhotoProps) {
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

	if (!imageUrl) {
		return <Skeleton width="100%" height={height} borderRadius="md" />;
	}

	return (
		<Box position="relative" width="100%" height={height} borderRadius="md" overflow="hidden">
			<Image
				src={imageUrl}
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
