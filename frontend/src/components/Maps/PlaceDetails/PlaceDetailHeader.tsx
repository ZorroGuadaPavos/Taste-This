import type { PlaceDetails } from "@/services/googleMapsService";
import { Box, HStack, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { FiChevronDown, FiChevronUp, FiStar } from "react-icons/fi";

interface PlaceDetailHeaderProps {
	placeDetails: PlaceDetails;
	open: boolean;
	onToggle: () => void;
}

export function PlaceDetailHeader({ placeDetails, open, onToggle }: PlaceDetailHeaderProps) {
	return (
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
	);
}
