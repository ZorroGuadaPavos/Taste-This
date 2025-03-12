import type { PlaceDetails } from "@/services/googleMapsService";
import { Box, Flex, HStack, Heading, Icon, Text, VStack } from "@chakra-ui/react";
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
		>
			{placeDetails.rating && (
				<HStack
					p={2}
					borderRadius="md"
					gap={1}
					bg="accent.matcha.light"
					color="accent.matcha.dark"
					px={3}
					py={1}
					position="absolute"
					top="2"
					right="2"
					zIndex="1"
				>
					<Icon as={FiStar} color="accent.matcha.dark" />
					<Text fontWeight="bold">{placeDetails.rating.toFixed(1)}</Text>
				</HStack>
			)}

			<HStack justify="space-between" width="100%">
				<VStack align="flex-start" gap={1}>
					<Heading size="lg" fontWeight="600" color="fg.DEFAULT">
						{placeDetails.displayName}
					</Heading>
					{placeDetails.formattedAddress && (
						<Text color="fg.muted" fontSize="sm">
							{placeDetails.formattedAddress}
						</Text>
					)}
				</VStack>
				<VStack align="flex-end" gap={2}>
					{/* Rating moved to top right corner */}
				</VStack>
			</HStack>

			<Flex position="absolute" bottom="-1px" left="50%" right="0" justifyContent="center" pointerEvents="none">
				<Box
					bg={open ? "accent.matcha.light" : "accent.lavender.light"}
					color={open ? "accent.matcha.dark" : "accent.lavender"}
					px={3}
					py={1}
					borderTopLeftRadius="md"
					borderTopRightRadius="md"
					fontSize="xs"
					fontWeight="medium"
				>
					{open ? "Hide details" : "Click to see details"}
				</Box>
			</Flex>
		</Box>
	);
}
