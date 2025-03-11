import { Tooltip } from "@/components/ui/tooltip";
import { Box, Flex, HStack, Heading, Text } from "@chakra-ui/react";
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

	return (
		<Box
			p={5}
			borderWidth="1px"
			borderRadius="xl"
			borderColor="bg.200"
			bg="bg.box"
			transition="all 0.2s ease"
			position="relative"
			overflow="hidden"
		>
			{mentionLevel >= 6 && (
				<Box
					position="absolute"
					top={0}
					right={0}
					bg="accent.sakura"
					color="white"
					px={2}
					py={1}
					fontSize="xs"
					fontWeight="bold"
					borderBottomLeftRadius="md"
				>
					Popular
				</Box>
			)}

			<Flex justify="space-between" align="center" mb={3}>
				<Heading fontSize="xl" textTransform="capitalize" fontWeight="600" color="fg.DEFAULT">
					{dish.name}
				</Heading>
				<HStack gap={2}>
					<Tooltip content="Average rating from reviews">
						<Box
							bg="accent.matcha.light"
							color="accent.matcha.dark"
							px={2}
							py={1}
							borderRadius="md"
							fontSize="sm"
							fontWeight="bold"
						>
							{dish.rating.toFixed(1)}
						</Box>
					</Tooltip>
				</HStack>
			</Flex>

			{dish.reviewExcerpts.length > 0 && (
				<Box mt={3} p={3} bg="bg.50" borderRadius="lg" borderLeft="3px solid" borderColor="accent.lavender.light">
					<Text fontStyle="italic" fontSize="sm" color="fg.muted">
						"{dish.reviewExcerpts[0]}"
					</Text>
				</Box>
			)}
		</Box>
	);
}
