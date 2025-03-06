import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import type { Dish } from "./types";

interface DishCardProps {
	dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
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
				<Heading fontSize="xl">{dish.name}</Heading>
				<Box bg="teal.500" color="white" px={2} py={1} borderRadius="md" fontWeight="bold">
					{dish.rating.toFixed(1)}/5
				</Box>
			</Flex>
			<Text mt={2} color="gray.600">
				Mentioned in {dish.mentions} reviews
			</Text>
			{dish.reviewExcerpts.length > 0 && (
				<Box mt={3} p={3} bg="gray.50" borderRadius="md">
					<Text fontStyle="italic" fontSize="sm">
						"{dish.reviewExcerpts[0]}"
					</Text>
				</Box>
			)}
		</Box>
	);
}
