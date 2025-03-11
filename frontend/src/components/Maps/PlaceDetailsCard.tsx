import { GoogleMapsConfig } from "@/config/maps";
import { type PlaceDetails, getPlaceDetails } from "@/services/googleMapsService";
import type { Place } from "@/types/Place";
import {
	Badge,
	Box,
	Flex,
	Grid,
	GridItem,
	HStack,
	Heading,
	Icon,
	Link,
	SimpleGrid,
	Text,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { memo, useEffect, useRef, useState } from "react";
import {
	FiChevronDown,
	FiChevronUp,
	FiClock,
	FiDollarSign,
	FiExternalLink,
	FiGlobe,
	FiInfo,
	FiPhone,
	FiStar,
} from "react-icons/fi";
import { PlaceDetailsSkeleton } from "./PlaceDetailsSkeleton";
import { PlacePhotosGallery } from "./PlacePhotosGallery";

function PlaceDetailsCardComponent({ place }: { place: Place }) {
	const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { open, onToggle } = useDisclosure({ defaultOpen: false });
	const detailsRef = useRef<HTMLDivElement>(null);

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
			<Badge colorScheme="green" variant="solid" bg="accent.matcha" color="white">
				Open Now
			</Badge>
		) : (
			<Badge colorScheme="red" variant="solid" bg="accent.pink.dark" color="white">
				Closed
			</Badge>
		);
	};

	const renderPriceLevel = (level?: number) => {
		if (!level) return "Not available";
		return Array(level).fill("$").join("");
	};

	if (isLoading) {
		return <PlaceDetailsSkeleton />;
	}

	if (error) {
		return (
			<Box
				maxW="100%"
				borderWidth="1px"
				borderRadius="xl"
				overflow="hidden"
				borderColor="accent.pink.dark"
				bg="bg.50"
				p={4}
			>
				<HStack>
					<Icon as={FiInfo} color="accent.pink.dark" boxSize={5} />
					<Text color="accent.pink.dark">{error}</Text>
				</HStack>
			</Box>
		);
	}

	if (!placeDetails) return null;

	return (
		<Box
			w="100%"
			maxW="2xl"
			borderWidth="1px"
			borderRadius="xl"
			overflow="hidden"
			borderColor="bg.200"
			bg="bg.box"
			boxShadow="sm"
			transition="all 0.3s ease"
			_hover={{ boxShadow: "md" }}
			position="relative"
		>
			{/* Header section with restaurant name and rating that is always visible */}
			<Box
				p={5}
				borderBottomWidth={open ? "0" : "1px"}
				borderColor="bg.100"
				onClick={onToggle}
				cursor="pointer"
				transition="all 0.2s ease"
				_hover={{ bg: "bg.50" }}
				position="relative"
				zIndex="1"
			>
				<HStack justify="space-between" width="100%">
					<VStack align="flex-start" gap={1}>
						<HStack>
							<Heading size="lg" fontWeight="600" color="fg.DEFAULT">
								{placeDetails.displayName}
							</Heading>
							<Icon
								as={open ? FiChevronUp : FiChevronDown}
								color="accent.lavender"
								boxSize={5}
								transition="transform 0.3s ease"
								transform={open ? "rotate(180deg)" : "rotate(0)"}
							/>
						</HStack>
						{placeDetails.formattedAddress && (
							<Text color="fg.muted" fontSize="sm">
								{placeDetails.formattedAddress}
							</Text>
						)}
					</VStack>
					{placeDetails.rating && (
						<HStack p={2} borderRadius="md" gap={1} bg="accent.matcha.light" color="accent.matcha.dark" px={3} py={1}>
							<Icon as={FiStar} color="accent.matcha.dark" />
							<Text fontWeight="bold">{placeDetails.rating.toFixed(1)}</Text>
						</HStack>
					)}
				</HStack>
			</Box>

			{/* Content container with fixed height */}
			<Box
				ref={detailsRef}
				height="auto"
				overflow="hidden"
				transition="height 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
				position="relative"
			>
				<Grid
					templateColumns={open ? { base: "1fr", md: "1fr 1fr" } : "1fr"}
					gap={4}
					transition="all 0.4s ease"
					height="100%"
				>
					{/* Photos column */}
					<GridItem
						order={open ? { base: 2, md: 1 } : 1}
						width="100%"
						transition="all 0.4s ease"
						px={5}
						pb={5}
						pt={open ? 0 : 5}
						display="flex"
						alignItems="center"
					>
						{placeDetails.photos && placeDetails.photos.length > 0 && (
							<Box
								width="100%"
								borderRadius="lg"
								overflow="hidden"
								boxShadow={open ? "sm" : "none"}
								height={open ? { base: "180px", md: "220px" } : "250px"}
							>
								<PlacePhotosGallery photos={placeDetails.photos} placeName={placeDetails.displayName} />
							</Box>
						)}
					</GridItem>

					{/* Details column - only visible when expanded */}
					{open && (
						<GridItem
							p={5}
							bg="bg.50"
							borderRadius="lg"
							borderLeftWidth={{ base: 0, md: "1px" }}
							borderLeftColor="bg.100"
							order={{ base: 1, md: 2 }}
							boxShadow="sm"
							position="relative"
							transition="all 0.4s ease"
							opacity={open ? 1 : 0}
							transform={open ? "translateY(0)" : "translateY(-20px)"}
							borderTopWidth={{ base: "1px", md: 0 }}
							borderTopColor="bg.100"
						>
							<VStack align="flex-start" gap={4} width="100%">
								<SimpleGrid columns={{ base: 1, md: open ? 1 : 2 }} gap={4} width="100%">
									{placeDetails.internationalPhoneNumber && (
										<HStack>
											<Icon as={FiPhone} color="accent.lavender" />
											<Text color="fg.DEFAULT">{placeDetails.internationalPhoneNumber}</Text>
										</HStack>
									)}

									{placeDetails.websiteUri && (
										<HStack>
											<Icon as={FiGlobe} color="accent.lavender" />
											<Link
												href={placeDetails.websiteUri}
												color="accent.matcha.dark"
												target="_blank"
												onClick={(e) => e.stopPropagation()}
												fontWeight="500"
											>
												Website
												<Icon as={FiExternalLink} mx="2px" boxSize="0.8em" />
											</Link>
										</HStack>
									)}
								</SimpleGrid>

								<Box width="100%" borderWidth="1px" borderRadius="xl" p={4} borderColor="bg.200" bg="bg.box">
									<Grid templateColumns="1fr 1fr" gap={4}>
										<Box>
											<Text fontSize="sm" color="fg.muted" mb={1}>
												Price Level
											</Text>
											<HStack>
												<Icon as={FiDollarSign} color="accent.pink" />
												<Text fontWeight="600" color="fg.DEFAULT">
													{renderPriceLevel(placeDetails.priceLevel)}
												</Text>
											</HStack>
										</Box>

										<Box>
											<Text fontSize="sm" color="fg.muted" mb={1}>
												Status
											</Text>
											<HStack>
												<Icon
													as={FiClock}
													color={placeDetails.regularOpeningHours?.openNow ? "accent.matcha" : "accent.pink.dark"}
												/>
												{formatOpenStatus(placeDetails.regularOpeningHours?.openNow)}
											</HStack>
										</Box>
									</Grid>
								</Box>

								{placeDetails.types && placeDetails.types.length > 0 && (
									<Box width="100%">
										<Text fontSize="sm" color="fg.muted" mb={2}>
											Categories
										</Text>
										<Flex gap={2} flexWrap="wrap">
											{placeDetails.types.map((type, index) => (
												<Box
													key={index}
													px={3}
													py={1}
													bg="accent.lavender.light"
													color="accent.lavender"
													fontSize="xs"
													borderRadius="full"
													fontWeight="500"
												>
													{type.replace(/_/g, " ")}
												</Box>
											))}
										</Flex>
									</Box>
								)}
							</VStack>
						</GridItem>
					)}
				</Grid>
			</Box>
		</Box>
	);
}

export const PlaceDetailsCard = memo(PlaceDetailsCardComponent, (prevProps, nextProps) => {
	return prevProps.place.id === nextProps.place.id;
});
