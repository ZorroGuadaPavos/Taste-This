import type { PlaceDetails } from "@/services/googleMapsService";
import { GridItem, HStack, Icon, Link, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { FiGlobe, FiPhone } from "react-icons/fi";
import { Categories } from "./Categories";
import { PriceAndStatus } from "./PriceAndStatus";

interface PlaceDetailsContentProps {
	placeDetails: PlaceDetails;
	open: boolean;
}

export function PlaceDetailsContent({ placeDetails, open }: PlaceDetailsContentProps) {
	return (
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
								{placeDetails.websiteUri}
							</Link>
						</HStack>
					)}
				</SimpleGrid>

				<PriceAndStatus
					priceRange={placeDetails.priceRange}
					priceLevel={placeDetails.priceLevel}
					isOpenNow={placeDetails.regularOpeningHours?.openNow}
				/>

				{placeDetails.types && placeDetails.types.length > 0 && <Categories types={placeDetails.types} />}
			</VStack>
		</GridItem>
	);
}
