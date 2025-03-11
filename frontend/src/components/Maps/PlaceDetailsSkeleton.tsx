import { Box, GridItem, SimpleGrid, Skeleton, VStack } from "@chakra-ui/react";

export function PlaceDetailsSkeleton() {
	return (
		<Box
			maxW="100%"
			borderWidth="1px"
			borderRadius="xl"
			overflow="hidden"
			borderColor="bg.200"
			p={4}
			bg="bg.box"
			boxShadow="sm"
		>
			<Box pb={4}>
				<Skeleton height="28px" width="70%" borderRadius="md" />
			</Box>
			<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
				<GridItem>
					<VStack align="flex-start" gap={3}>
						<Skeleton height="20px" width="60%" borderRadius="md" />
						<Skeleton height="20px" width="90%" borderRadius="md" />
						<Skeleton height="20px" width="40%" borderRadius="md" />
						<Skeleton height="20px" width="80%" borderRadius="md" />
					</VStack>
				</GridItem>
				<GridItem>
					<Skeleton height="200px" borderRadius="md" />
				</GridItem>
			</SimpleGrid>
		</Box>
	);
}
