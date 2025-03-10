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
	useDisclosure,
} from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import {
	FiClock,
	FiDollarSign,
	FiExternalLink,
	FiGlobe,
	FiInfo,
	FiMapPin,
	FiPhone,
	FiStar,
	FiChevronDown,
	FiChevronUp,
} from "react-icons/fi";
import type { Place } from "./RestaurantPicker";
import { PlacePhotosGallery } from "./PlacePhotosGallery";

function PlaceDetailsCardComponent({ place }: { place: Place }) {
	const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { open, onToggle } = useDisclosure({ defaultOpen: false });

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
		<Box w="100%" maxW="2xl" borderWidth="1px" borderRadius="lg" overflow="hidden" borderColor="gray.200" bg="white">
			{/* Header section with restaurant name and rating that is always visible */}
			<Box 
				p={4} 
				borderBottomWidth="1px" 
				onClick={onToggle} 
				cursor="pointer" 
				_hover={{ bg: "gray.50" }}
				transition="background-color 0.2s"
			>
				<VStack align="flex-start" gap={4} width="100%">
					<HStack justify="space-between" align="center" width="100%">
						<VStack align="flex-start" gap={1}>
							<HStack>
								<Heading size="lg">{placeDetails.displayName}</Heading>
								<Icon 
									as={open ? FiChevronUp : FiChevronDown} 
									color="gray.500"
									boxSize={5}
									transition="transform 0.2s"
								/>
							</HStack>
							{placeDetails.formattedAddress && (
								<Text color="gray.600" fontSize="sm">{placeDetails.formattedAddress}</Text>
							)}
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
					
					{/* Photos gallery below the restaurant name - always visible */}
					{placeDetails.photos && placeDetails.photos.length > 0 && (
						<Box width="100%">
							<PlacePhotosGallery photos={placeDetails.photos} placeName={placeDetails.displayName} />
						</Box>
					)}
				</VStack>
			</Box>

			{/* Collapsible details section with smooth transition */}
			<Box 
				position="relative"
				height={open ? "auto" : "0px"}
				overflow="hidden"
				transition="height 0.3s ease-in-out, opacity 0.3s ease-in-out"
				opacity={open ? 1 : 0}
				visibility={open ? "visible" : "hidden"}
			>
				<Box 
					p={4} 
					borderTopWidth="1px" 
					borderColor="gray.100"
					position="relative"
				>
					<VStack align="flex-start" gap={4} width="100%">
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
									<Link href={placeDetails.websiteUri} color="blue.500" target="_blank" onClick={(e) => e.stopPropagation()}>
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

						{placeDetails.types && placeDetails.types.length > 0 && (
							<Box width="100%">
								<Text fontSize="sm" color="gray.600" mb={2}>
									Categories
								</Text>
								<Flex gap={2} flexWrap="wrap">
									{placeDetails.types.map((type, index) => (
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
								</Flex>
							</Box>
						)}
					</VStack>
				</Box>
			</Box>
		</Box>
	);
}

export const PlaceDetailsCard = memo(PlaceDetailsCardComponent, (prevProps, nextProps) => {
	return prevProps.place.id === nextProps.place.id;
});
