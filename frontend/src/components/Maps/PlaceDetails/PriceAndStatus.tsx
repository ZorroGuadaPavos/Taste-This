import { Badge, Box, Grid, HStack, Icon, Text } from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";

interface PriceAndStatusProps {
	priceLevel?: string;
	isOpenNow?: boolean;
}

export function PriceAndStatus({ priceLevel, isOpenNow }: PriceAndStatusProps) {
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

	const formatPriceRange = (level?: string) => {
		return level || "Not available";
	};

	return (
		<Box width="100%" borderWidth="1px" borderRadius="xl" p={4} borderColor="bg.200" bg="bg.box">
			<Grid templateColumns="1fr 1fr" gap={4}>
				<Box>
					<Text fontSize="sm" color="fg.muted" mb={1}>
						Price Range
					</Text>
					<HStack>
						<Text fontWeight="600" color="fg.DEFAULT">
							{formatPriceRange(priceLevel)}
						</Text>
					</HStack>
				</Box>

				<Box>
					<Text fontSize="sm" color="fg.muted" mb={1}>
						Status
					</Text>
					<HStack>
						<Icon as={FiClock} color={isOpenNow ? "accent.matcha" : "accent.pink.dark"} />
						{formatOpenStatus(isOpenNow)}
					</HStack>
				</Box>
			</Grid>
		</Box>
	);
}
