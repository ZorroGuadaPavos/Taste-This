import type { GetRestaurantsDishesResponse } from "@/client";
import type { Place } from "@/types/Place";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { memo } from "react";
import { FaUtensils } from "react-icons/fa";
import { DishCard } from "./DishCard";

interface RecommendationsListProps {
	recommendations: GetRestaurantsDishesResponse;
	place: Place | null;
}

function RecommendationsListComponent({ recommendations, place }: RecommendationsListProps) {
	if (!recommendations || !place) {
		return null;
	}

	const filteredAndSortedDishes = recommendations.popularDishes
		? [...recommendations.popularDishes].sort((a, b) => {
				if (b.mentions !== a.mentions) {
					return b.mentions - a.mentions;
				}
				if (b.rating !== a.rating) {
					return b.rating - a.rating;
				}
				return b.sentimentScore - a.sentimentScore;
			})
		: [];

	const hasPopularDishes = filteredAndSortedDishes.length > 0;

	return (
		<Box w="100%" maxW="2xl">
			{hasPopularDishes ? (
				<>
					<Flex align="center" mb={4}>
						<Box fontSize="md" color="accent.sakura" mr={2}>
							<FaUtensils />
						</Box>
						<Text fontSize="lg" fontWeight="500" color="fg.DEFAULT">
							Top recommendations
						</Text>
					</Flex>
					<VStack gap={4} align="stretch">
						{filteredAndSortedDishes.map((dish) => (
							<DishCard key={dish.name} dish={dish} />
						))}
					</VStack>
				</>
			) : (
				<Box textAlign="center" py={8} px={4} borderRadius="xl" borderWidth="1px" borderColor="bg.200" bg="bg.50">
					<Heading as="h2" size="md" mb={2} color="fg.DEFAULT">
						No popular dishes found
					</Heading>
					<Text color="fg.muted">We couldn't find any dish recommendations for {place.name}</Text>
				</Box>
			)}
		</Box>
	);
}

export const RecommendationsList = memo(RecommendationsListComponent, (prevProps, nextProps) => {
	return prevProps.place?.id === nextProps.place?.id && prevProps.recommendations === nextProps.recommendations;
});
