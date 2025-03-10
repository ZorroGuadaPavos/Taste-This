import { GoogleMapsConfig } from "@/config/maps";
import { type PlaceDetails, getPlaceDetails } from "@/services/googleMapsService";
import {
	Badge,
	Box,
	Flex,
	Grid,
	GridItem,
	HStack,
	Heading,
	Icon,
	Image,
	Link,
	SimpleGrid,
	Skeleton,
	Text,
	VStack,
} from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import {
	FiCamera,
	FiClock,
	FiDollarSign,
	FiExternalLink,
	FiGlobe,
	FiInfo,
	FiMapPin,
	FiPhone,
	FiStar,
} from "react-icons/fi";
import type { Place } from "./RestaurantPicker";

function PlaceDetailsCardComponent({ place }: { place: Place }) {
	const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

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

	const formatOpenStatus = (isOpen?: boolean) => {
		if (isOpen === undefined) return null;
		return isOpen ? (
			<Badge colorScheme="green" variant="solid">
				Open Now
			</Badge>
		) : (
			<Badge colorScheme="red" variant="solid">
				Closed
			</Badge>
		);
	};

	const renderPriceLevel = (level?: number) => {
		if (!level) return "Not available";
		return Array(level).fill("$").join("");
	};

	const handleThumbnailClick = (index: number) => {
		setSelectedPhotoIndex(index + 1);
	};

	if (isLoading) {
		return (
			<Box maxW="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" borderColor="gray.200" p={4}>
				<Box pb={4}>
					<Skeleton height="28px" width="70%" />
				</Box>
				<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
					<GridItem>
						<VStack align="flex-start" gap={3}>
							<Skeleton height="20px" width="60%" />
							<Skeleton height="20px" width="90%" />
							<Skeleton height="20px" width="40%" />
							<Skeleton height="20px" width="80%" />
						</VStack>
					</GridItem>
					<GridItem>
						<Skeleton height="200px" borderRadius="md" />
					</GridItem>
				</SimpleGrid>
			</Box>
		);
	}

	if (error) {
		return (
			<Box maxW="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" borderColor="red.300" bg="red.50" p={4}>
				<HStack>
					<Icon as={FiInfo} color="red.500" boxSize={5} />
					<Text color="red.500">{error}</Text>
				</HStack>
			</Box>
		);
	}

	if (!placeDetails) return null;

	return (
		<Box maxW="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" borderColor="gray.200" bg="white">
			<Box p={4} borderBottomWidth="1px">
				<HStack justify="space-between" align="center">
					<VStack align="flex-start" gap={1}>
						<Heading size="lg">{placeDetails.displayName}</Heading>
						<HStack gap={2} flexWrap="wrap">
							{placeDetails.types?.slice(0, 3).map((type, index) => (
								<Box
									key={index}
									px={2}
									py={1}
									bg="blue.50"
									color="blue.800"
									fontSize="xs"
									borderRadius="full"
									fontWeight="medium"
								>
									{type.replace(/_/g, " ")}
								</Box>
							))}
						</HStack>
					</VStack>
					{placeDetails.rating && (
						<HStack bg="yellow.50" p={2} borderRadius="md" gap={1}>
							<Icon as={FiStar} color="yellow.500" />
							<Text fontWeight="bold">{placeDetails.rating.toFixed(1)}</Text>
							{placeDetails.userRatingCount && (
								<Text fontSize="xs" color="gray.600">
									({placeDetails.userRatingCount})
								</Text>
							)}
						</HStack>
					)}
				</HStack>
			</Box>
			<Box p={4}>
				<Grid templateColumns={{ base: "1fr", md: "3fr 2fr" }} gap={6}>
					<GridItem>
						<VStack align="flex-start" gap={4}>
							{placeDetails.formattedAddress && (
								<HStack align="flex-start" width="100%">
									<Icon as={FiMapPin} mt={1} color="gray.600" />
									<Text>{placeDetails.formattedAddress}</Text>
								</HStack>
							)}

							<SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} width="100%">
								{placeDetails.internationalPhoneNumber && (
									<HStack>
										<Icon as={FiPhone} color="gray.600" />
										<Text>{placeDetails.internationalPhoneNumber}</Text>
									</HStack>
								)}

								{placeDetails.websiteUri && (
									<HStack>
										<Icon as={FiGlobe} color="gray.600" />
										<Link href={placeDetails.websiteUri} color="blue.500" target="_blank">
											Website
											<Icon as={FiExternalLink} mx="2px" boxSize="0.8em" />
										</Link>
									</HStack>
								)}
							</SimpleGrid>

							<Box width="100%" borderWidth="1px" borderRadius="md" p={3}>
								<Grid templateColumns="1fr 1fr" gap={4}>
									<Box>
										<Text fontSize="sm" color="gray.600">
											Price Level
										</Text>
										<HStack>
											<Icon as={FiDollarSign} color="green.500" />
											<Text fontWeight="bold">{renderPriceLevel(placeDetails.priceLevel)}</Text>
										</HStack>
									</Box>

									<Box>
										<Text fontSize="sm" color="gray.600">
											Status
										</Text>
										<HStack>
											<Icon as={FiClock} color={placeDetails.regularOpeningHours?.openNow ? "green.500" : "red.500"} />
											{formatOpenStatus(placeDetails.regularOpeningHours?.openNow)}
										</HStack>
									</Box>
								</Grid>
							</Box>

							{placeDetails.regularOpeningHours?.weekdayDescriptions &&
								placeDetails.regularOpeningHours.weekdayDescriptions.length > 0 && (
									<Box width="100%" borderWidth="1px" borderRadius="md" p={3}>
										<Text fontWeight="medium" mb={2}>
											Hours
										</Text>
										<VStack align="flex-start" gap={1}>
											{placeDetails.regularOpeningHours.weekdayDescriptions.map((day, index) => (
												<Text key={index} fontSize="sm">
													{day}
												</Text>
											))}
										</VStack>
									</Box>
								)}
						</VStack>
					</GridItem>

					<GridItem>
						{placeDetails.photos && placeDetails.photos.length > 0 ? (
							<Box>
								{/* Main featured photo */}
								<Box position="relative" width="100%" height="250px" mb={2}>
									<Image
										src={`https://places.googleapis.com/v1/${placeDetails.photos[selectedPhotoIndex]?.name || placeDetails.photos[0].name}/media?key=${GoogleMapsConfig.apiKey}&maxHeightPx=800&maxWidthPx=1200`}
										alt={`${placeDetails.displayName} - photo ${selectedPhotoIndex + 1}`}
										borderRadius="md"
										objectFit="cover"
										width="100%"
										height="100%"
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

									{/* Photo count badge */}
									{placeDetails.photos.length > 1 && (
										<Box
											position="absolute"
											bottom="8px"
											right="8px"
											bg="blackAlpha.700"
											color="white"
											borderRadius="md"
											px={2}
											py={1}
											fontSize="xs"
										>
											<HStack gap={1}>
												<Icon as={FiCamera} />
												<Text>{placeDetails.photos.length} photos</Text>
											</HStack>
										</Box>
									)}
								</Box>

								{/* Thumbnail gallery */}
								{placeDetails.photos.length > 1 && (
									<SimpleGrid columns={Math.min(placeDetails.photos.length - 1, 4)} gap={2}>
										{placeDetails.photos.slice(1, 5).map((photo, index) => (
											<Box
												key={photo.name}
												position="relative"
												height="60px"
												borderRadius="md"
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
													src={`https://places.googleapis.com/v1/${photo.name}/media?key=${GoogleMapsConfig.apiKey}&maxHeightPx=120&maxWidthPx=120`}
													alt={`${placeDetails.displayName} - photo ${index + 2}`}
													objectFit="cover"
													width="100%"
													height="100%"
													borderRadius="md"
												/>
											</Box>
										))}

										{/* Show "more photos" thumbnail if there are more than 5 photos */}
										{placeDetails.photos.length > 5 && (
											<Box
												position="relative"
												height="60px"
												borderRadius="md"
												overflow="hidden"
												bg="gray.100"
												display="flex"
												justifyContent="center"
												alignItems="center"
												transition="all 0.2s"
												cursor="pointer"
												_hover={{
													bg: "gray.200",
													transform: "scale(1.05)",
													boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
												}}
											>
												<Text fontSize="sm" fontWeight="medium" color="gray.700">
													+{placeDetails.photos.length - 5} more
												</Text>
											</Box>
										)}
									</SimpleGrid>
								)}
							</Box>
						) : (
							<Flex height="250px" bg="gray.100" borderRadius="md" justifyContent="center" alignItems="center">
								<Text color="gray.500">No photos available</Text>
							</Flex>
						)}
					</GridItem>
				</Grid>
			</Box>
		</Box>
	);
}

export const PlaceDetailsCard = memo(PlaceDetailsCardComponent, (prevProps, nextProps) => {
	return prevProps.place.id === nextProps.place.id;
});
