import type { GetAnalysisResponse } from "@/client";
import { Box, Heading, VStack } from "@chakra-ui/react";
import { memo } from "react";
import { DishCard } from "./DishCard";
import type { Place } from "./Maps/RestaurantPicker";

interface RecommendationsListProps {
	recommendations: GetAnalysisResponse;
	place: Place | null;
}

function RecommendationsListComponent({ recommendations, place }: RecommendationsListProps) {
	if (!recommendations || !place) {
		return null;
	}

	const filteredAndSortedDishes = recommendations.popularDishes
		? [...recommendations.popularDishes].sort((a, b) => {
				if (b.rating !== a.rating) {
					return b.rating - a.rating;
				}
				if (b.mentions !== a.mentions) {
					return b.mentions - a.mentions;
				}
				return b.sentimentScore - a.sentimentScore;
			})
		: [];

	const hasPopularDishes = filteredAndSortedDishes.length > 0;

	return (
		<Box w="100%" maxW="2xl">
			{hasPopularDishes ? (
				<VStack gap={4} align="stretch">
					{filteredAndSortedDishes.map((dish) => (
						<DishCard key={dish.name} dish={dish} />
					))}
				</VStack>
			) : (
				<Heading as="h2" size="lg" mb={4} color="teal.600" textAlign="center">
					No popular dishes found for {place.name}
				</Heading>
			)}
		</Box>
	);
}

export const RecommendationsList = memo(RecommendationsListComponent, (prevProps, nextProps) => {
	return prevProps.place?.id === nextProps.place?.id && prevProps.recommendations === nextProps.recommendations;
});
