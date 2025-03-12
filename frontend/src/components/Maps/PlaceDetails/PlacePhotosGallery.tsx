import { GoogleMapsConfig } from "@/config/maps";
import { Box, Flex, Grid, GridItem, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useState } from "react";
import { PhotoThumbnailsGrid } from "./PhotoThumbnailsGrid";

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
	isOpen?: boolean;
}

export function PlacePhotosGallery({ photos, placeName, isOpen = false }: PlacePhotosGalleryProps) {
	const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

	const handleThumbnailClick = (index: number) => {
		setSelectedPhotoIndex(index);
	};

	if (!photos || photos.length === 0) {
		return (
			<Flex
				height="100%"
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

	// If the card is open, show only the main photo
	if (isOpen) {
		return (
			<Box position="relative" width="100%" height="100%" borderRadius="md" overflow="hidden">
				<Image
					src={`https://places.googleapis.com/v1/${photos[selectedPhotoIndex]?.name || photos[0].name}/media?key=${GoogleMapsConfig.apiKey}&maxHeightPx=400&maxWidthPx=800`}
					alt={`${placeName} - photo ${selectedPhotoIndex + 1}`}
					objectFit="cover"
					width="100%"
					height="100%"
					borderRadius="md"
					onClick={() => {}}
					cursor="pointer"
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
		);
	}

	// When card is closed, show an enhanced grid layout
	return (
		<Grid
			templateColumns={{ base: "1fr", md: "1fr" }}
			templateRows={{ base: "auto auto", md: "2fr auto" }}
			gap={2}
			height="100%"
			width="100%"
		>
			{/* Main large image */}
			<GridItem
				colSpan={1}
				rowSpan={1}
				height={{ base: "12rem", md: "auto" }}
				minHeight={{ md: "70%" }}
				borderRadius="md"
				overflow="hidden"
			>
				<Image
					src={`https://places.googleapis.com/v1/${photos[selectedPhotoIndex]?.name || photos[0].name}/media?key=${GoogleMapsConfig.apiKey}&maxHeightPx=400&maxWidthPx=800`}
					alt={`${placeName} - photo ${selectedPhotoIndex + 1}`}
					objectFit="cover"
					width="100%"
					height="100%"
					borderRadius="md"
					onClick={() => {}}
					cursor="pointer"
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
			</GridItem>

			{/* Thumbnails row - desktop view */}
			<GridItem colSpan={1} rowSpan={1} display={{ base: "none", md: "block" }} height="6rem">
				<Grid templateColumns="repeat(6, 1fr)" height="100%" gap={2}>
					{photos.slice(1, 7).map((photo, index) => (
						<Box key={index} borderRadius="md" overflow="hidden" position="relative" height="100%">
							<Image
								src={`https://places.googleapis.com/v1/${photo.name}/media?key=${GoogleMapsConfig.apiKey}&maxHeightPx=200&maxWidthPx=200`}
								alt={`${placeName} - photo ${index + 2}`}
								objectFit="cover"
								width="100%"
								height="100%"
								borderRadius="md"
								loading="lazy"
								onClick={() => handleThumbnailClick(index + 1)}
								cursor="pointer"
							/>
						</Box>
					))}
				</Grid>
			</GridItem>

			{/* Mobile thumbnails - shown in a horizontal row */}
			<GridItem colSpan={1} display={{ base: "block", md: "none" }}>
				<PhotoThumbnailsGrid
					photos={photos}
					placeName={placeName}
					onThumbnailClick={handleThumbnailClick}
					maxThumbnails={6}
					showMoreIndicator={false}
				/>
			</GridItem>
		</Grid>
	);
}
