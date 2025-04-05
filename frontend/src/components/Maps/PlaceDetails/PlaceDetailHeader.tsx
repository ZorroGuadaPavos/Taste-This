import type { Place } from "@/types/Place";
import { Box, Flex, HStack, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { FiStar } from "react-icons/fi";

interface PlaceDetailHeaderProps {
	place: Place;
	open: boolean;
	onToggle: () => void;
}

const RatingBadge = ({ rating }: { rating: number }) => (
	<HStack
		position="absolute"
		top="2"
		right="2"
		p={2}
		borderRadius="md"
		bg="accent.matcha.light"
		color="accent.matcha.dark"
		px={3}
		py={1}
		zIndex="1"
	>
		<Icon as={FiStar} fill="accent.matcha.dark" />
		<Text fontWeight="bold">{rating.toFixed(1)}</Text>
	</HStack>
);

const ToggleIndicator = ({ open }: { open: boolean }) => (
	<Flex position="absolute" bottom="-1px" left="50%" right="0" justifyContent="center" pointerEvents="none">
		<Box
			bg={open ? "accent.pink.dark" : "accent.lavender"}
			color="white"
			px={3}
			py={1}
			borderTopLeftRadius="md"
			borderTopRightRadius="md"
			fontSize="xs"
			fontWeight="medium"
		>
			{open ? "Hide details" : "Show details"}
		</Box>
	</Flex>
);

export function PlaceDetailHeader({ place, open, onToggle }: PlaceDetailHeaderProps) {
	const { name, address, rating } = place;

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
			{rating !== null && <RatingBadge rating={rating} />}

			<VStack align="flex-start" gap={1}>
				<Heading size="lg" fontWeight="600" color="fg.DEFAULT">
					{name}
				</Heading>
				<Text color="fg.muted" fontSize="sm">
					{address}
				</Text>
			</VStack>

			<ToggleIndicator open={open} />
		</Box>
	);
}
