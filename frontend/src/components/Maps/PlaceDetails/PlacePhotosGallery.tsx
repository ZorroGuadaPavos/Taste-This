import { GoogleMapsConfig } from "@/config/maps";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useState } from "react";

export interface Photo {
	name: string;
	widthPx?: number;
	heightPx?: number;
	authorAttributions?: Array<{
		displayName?: string;
		uri?: string;
		photoUri?: string;
	}>;
}

interface PlacePhotosGalleryProps {
	photos?: Photo[];
	placeName: string;
}

export function PlacePhotosGallery({ photos, placeName }: PlacePhotosGalleryProps) {
	const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

	const handleThumbnailClick = (index: number) => {
		setSelectedPhotoIndex(index + 1);
	};

	if (!photos || photos.length === 0) {
		return (
			<Flex
				height="150px"
				bg="gray.100"
				borderRadius="md"
				justifyContent="center"
				alignItems="center"
				transition="height 0.2s ease-in-out"
			>
				<Text color="gray.500">No photos available</Text>
			</Flex>
		);
	}

	return (
		<Box>
			{/* Main featured photo */}
			<Box position="relative" width="100%" height="20rem" mb={2} borderRadius="md" overflow="hidden">
				<Image
					src={`https://places.googleapis.com/v1/${photos[selectedPhotoIndex]?.name || photos[0].name}/media?key=${GoogleMapsConfig.apiKey}&maxHeightPx=400&maxWidthPx=800`}
					alt={`${placeName} - photo ${selectedPhotoIndex + 1}`}
					objectFit="cover"
					width="100%"
					height="100%"
					transition="opacity 0.3s ease-in-out"
					borderRadius="xl"
					onError={(e) => {
						const target = e.target as HTMLImageElement;
						target.style.display = "none";
						const parent = target.parentElement;
						if (parent) {
							const fallback = document.createElement("div");
							fallback.style.width = "100%";
							fallback.style.height = "100%";
							fallback.style.backgroundColor = "#f0f0f0";
							fallback.style.display = "flex";
							fallback.style.justifyContent = "center";
							fallback.style.alignItems = "center";
							fallback.style.borderRadius = "0.375rem";

							const text = document.createElement("p");
							text.textContent = "Unable to load image";
							text.style.color = "#718096";

							fallback.appendChild(text);
							parent.appendChild(fallback);
						}
					}}
				/>
			</Box>

			{photos.length > 1 && (
				<SimpleGrid columns={Math.min(photos.length - 1, 5)} gap={2} transition="opacity 0.2s ease-in-out">
					{photos.slice(1, 6).map((photo, index) => (
						<Box
							key={photo.name}
							position="relative"
							height="5rem"
							borderRadius="xl"
							overflow="hidden"
							transition="all 0.2s"
							cursor="pointer"
							onClick={() => handleThumbnailClick(index)}
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
				</SimpleGrid>
			)}
		</Box>
	);
}
