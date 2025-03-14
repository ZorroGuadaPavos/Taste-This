import { Badge, Box, Grid, HStack, Icon, Text } from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";

interface PriceAndStatusProps {
	priceRange?: {
		startPrice?: {
			currencyCode?: string;
			units?: string;
			nanos?: number;
		};
		endPrice?: {
			currencyCode?: string;
			units?: string;
			nanos?: number;
		};
	};
	priceLevel?: string;
	isOpenNow?: boolean;
}

export function PriceAndStatus({ priceRange, priceLevel, isOpenNow }: PriceAndStatusProps) {
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

	const formatPriceRange = (range?: PriceAndStatusProps["priceRange"], level?: string) => {
		if (range?.startPrice) {
			const getCurrencySymbol = (currencyCode?: string) => {
				switch (currencyCode) {
					case "USD":
						return "$";
					case "EUR":
						return "€";
					case "GBP":
						return "£";
					case "JPY":
						return "¥";
					default:
						return currencyCode || "";
				}
			};

			const formatPrice = (price: any) => {
				if (!price) return "";
				return price.units || "0";
			};

			const currencySymbol = getCurrencySymbol(range.startPrice.currencyCode);
			const startPrice = formatPrice(range.startPrice);

			if (!range.endPrice) {
				return `${startPrice}+ ${currencySymbol}`;
			}

			const endPrice = formatPrice(range.endPrice);
			return `${startPrice}-${endPrice} ${currencySymbol}`;
		}

		if (level !== undefined) {
			if (typeof level === "string") {
				if (level === "PRICE_LEVEL_UNSPECIFIED") {
					return "Unknown";
				}
				const pricePart = level.replace("PRICE_LEVEL_", "");
				return pricePart.charAt(0).toUpperCase() + pricePart.slice(1).toLowerCase();
			}
		}

		return "Not available";
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
							{formatPriceRange(priceRange, priceLevel)}
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
