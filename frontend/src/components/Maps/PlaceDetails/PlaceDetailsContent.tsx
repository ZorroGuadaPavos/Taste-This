import type { PlaceDetails } from "@/services/googleMapsService";
import { Box, Flex, HStack, Icon, Link, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { FiGlobe, FiPhone } from "react-icons/fi";
import { Categories } from "./Categories";
import { PriceAndStatus } from "./PriceAndStatus";

interface PlaceDetailsContentProps {
	placeDetails: PlaceDetails;
	open: boolean;
}

export function PlaceDetailsContent({ placeDetails, open }: PlaceDetailsContentProps) {
	return (
		<Box
			p={3}
			bg="bg.50"
			borderBottomLeftRadius="lg"
			borderLeftWidth={{ base: 0, md: "1px" }}
			borderLeftColor="bg.100"
			width="100%"
			height="100%"
			overflow="visible"
			boxShadow="sm"
			position="relative"
			transition="all 0.4s ease"
			opacity={open ? 1 : 0}
			transform={open ? "translateY(0)" : "translateY(-20px)"}
			borderTopWidth={{ base: "1px", md: 0 }}
			borderTopColor="bg.100"
		>
			<VStack align="flex-start" gap={2} width="100%">
				<SimpleGrid columns={{ base: 1, md: 1 }} gap={2} width="100%">
					{placeDetails.internationalPhoneNumber && (
						<HStack gap={2}>
							<Icon as={FiPhone} color="accent.lavender" boxSize="0.9rem" />
							<Text fontSize="sm" color="fg.DEFAULT">
								{placeDetails.internationalPhoneNumber}
							</Text>
						</HStack>
					)}

					{placeDetails.websiteUri && (
						<HStack gap={2} overflow="hidden">
							<Icon as={FiGlobe} color="accent.lavender" boxSize="0.9rem" minWidth="0.9rem" />
							<Link
								href={placeDetails.websiteUri}
								color="accent.matcha.dark"
								target="_blank"
								onClick={(e) => e.stopPropagation()}
								fontWeight="500"
								fontSize="sm"
								maxWidth="100%"
								overflow="hidden"
								textOverflow="ellipsis"
								whiteSpace="nowrap"
							>
								{placeDetails.websiteUri}
							</Link>
						</HStack>
					)}
				</SimpleGrid>

				<Box w="100%" h="1px" bg="gray.100" my={1} />

				<PriceAndStatus
					priceRange={placeDetails.priceRange}
					priceLevel={placeDetails.priceLevel}
					isOpenNow={placeDetails.regularOpeningHours?.openNow}
				/>

				<Box w="100%" h="1px" bg="gray.100" my={1} />

				{placeDetails.types && placeDetails.types.length > 0 && <Categories types={placeDetails.types} />}
			</VStack>
		</Box>
	);
}
