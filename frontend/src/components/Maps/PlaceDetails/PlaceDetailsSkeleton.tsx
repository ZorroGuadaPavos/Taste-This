import { Box, GridItem, SimpleGrid, Skeleton, VStack } from "@chakra-ui/react";

export function PlaceDetailsSkeleton() {
	return (
		<Box w="100%" maxW="2xl" borderWidth="1px" borderRadius="xl" p={4} boxShadow="sm">
			<Box pb={4}>
				<Skeleton height="1.5rem" width="70%" borderRadius="md" />
			</Box>
			<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
				<GridItem>
					<Skeleton height="12rem" borderRadius="md" />
				</GridItem>
				<GridItem>
					<VStack align="flex-start" gap={3}>
						<Skeleton height="1.2rem" width="60%" borderRadius="md" />
						<Skeleton height="1.2rem" width="90%" borderRadius="md" />
						<Skeleton height="1.2rem" width="40%" borderRadius="md" />
						<Skeleton height="1.2rem" width="80%" borderRadius="md" />
					</VStack>
				</GridItem>
			</SimpleGrid>
		</Box>
	);
}
