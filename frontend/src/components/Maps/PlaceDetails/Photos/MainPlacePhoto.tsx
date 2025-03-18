import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import DummyPhoto from "/dummy_800x400.png";

interface MainPlacePhotoProps {
	placeName: string;
	height?: string | object;
	onClick?: () => void;
}

export function MainPlacePhoto({ placeName, height = "100%", onClick }: MainPlacePhotoProps) {
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
				src={DummyPhoto}
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
