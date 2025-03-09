import { Tooltip } from "@/components/ui/tooltip";
import { Box, Flex, HStack, Heading, Text } from "@chakra-ui/react";
import { FaFire } from "react-icons/fa";
import type { Dish } from "./types";

interface DishCardProps {
	dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
	const getMentionLevel = (mentions: number) => {
		if (!mentions || mentions <= 0) return 0;
		return Math.min(10, Math.max(1, Math.ceil(Math.log10(mentions) * 5)));
	};

	const mentionLevel = getMentionLevel(dish.mentions || 0);

	const getIconColor = (level: number) => {
		if (level >= 8) return "#E53E3E"; // Red - hot!
		if (level >= 6) return "#DD6B20"; // Orange - very popular
		if (level >= 4) return "#D69E2E"; // Yellow - popular
		if (level >= 2) return "#38A169"; // Green - mentioned
		return "#718096"; // Gray - barely mentioned
	};

	return (
		<Box
			p={5}
			shadow="md"
			borderWidth="1px"
			borderRadius="md"
			_hover={{ shadow: "lg", borderColor: "teal.300" }}
			transition="all 0.2s"
		>
			<Flex justify="space-between" align="center">
				<Heading fontSize="xl" textTransform="capitalize">
					{dish.name}
				</Heading>
				<HStack gap={2}>
					{mentionLevel > 0 && (
						<Tooltip content={`Popularity: ${mentionLevel}/10`}>
							<Box fontSize="1.2em" color={getIconColor(mentionLevel)}>
								<FaFire />
							</Box>
						</Tooltip>
					)}
					<Tooltip content="Average rating from reviews">
						<Box bg="teal.500" color="white" px={2} py={1} borderRadius="md" fontWeight="bold">
							{dish.rating.toFixed(1)}/5
						</Box>
					</Tooltip>
				</HStack>
			</Flex>
			{dish.reviewExcerpts.length > 0 && (
				<Box mt={3} p={3} bg="gray.50" borderRadius="lg">
					<Text fontStyle="italic" fontSize="sm">
						"{dish.reviewExcerpts[0]}"
					</Text>
				</Box>
			)}
		</Box>
	);
}
