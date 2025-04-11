import type { Place } from "@/types/Place";
import { Box, HStack, Icon, Link, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import type React from "react";
import { FiGlobe, FiPhone } from "react-icons/fi";
import { Categories } from "./Categories";
import { PriceAndStatus } from "./PriceAndStatus";

interface ContactInfoProps {
	icon: React.ElementType;
	color?: string;
	children: React.ReactNode;
}

function ContactInfo({ icon, color = "accent.lavender", children }: ContactInfoProps) {
	return (
		<HStack gap={2} overflow="hidden">
			<Icon as={icon} color={color} boxSize="0.9rem" minWidth="0.9rem" />
			{children}
		</HStack>
	);
}

function Divider() {
	return <Box w="100%" h="1px" bg="gray.100" my={1} />;
}

interface PlaceDetailsContentProps {
	place: Place;
	open: boolean;
}

export function PlaceDetailsContent({ place, open }: PlaceDetailsContentProps) {
	return (
		<Box
			p={3}
			bg="bg.50"
			borderBottomLeftRadius="lg"
			borderTopLeftRadius="lg"
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
			borderTopColor="bg.100"
		>
			<VStack align="flex-start" gap={2} width="100%">
				<SimpleGrid columns={{ base: 1, md: 1 }} gap={2} width="100%">
					{place.phone && (
						<ContactInfo icon={FiPhone}>
							<Text fontSize="sm" color="fg.DEFAULT">
								{place.phone}
							</Text>
						</ContactInfo>
					)}

					{place.website && (
						<ContactInfo icon={FiGlobe}>
							<Link
								href={place.website}
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
								Website
							</Link>
						</ContactInfo>
					)}
				</SimpleGrid>

				<Divider />

				<PriceAndStatus
					priceLevel={place.priceLevel === null ? undefined : place.priceLevel}
					isOpenNow={place.openNow}
				/>

				<Divider />

				{place.categories && place.categories.length > 0 && <Categories types={place.categories} />}
			</VStack>
		</Box>
	);
}
