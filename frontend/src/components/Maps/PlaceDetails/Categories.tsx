import { Box, Flex, Text } from "@chakra-ui/react";

interface CategoriesProps {
	types: string[];
}

export function Categories({ types }: CategoriesProps) {
	if (!types || types.length === 0) return null;

	// Filter and limit categories to only show the relevant ones
	const relevantTypes = types
		.filter((type) => !type.includes("establishment") && !type.includes("point_of_interest"))
		.slice(0, 4);

	if (relevantTypes.length === 0) return null;

	return (
		<Box width="100%">
			<Text fontSize="xs" color="fg.muted" mb={1} fontWeight="medium">
				Categories
			</Text>
			<Flex gap={1} flexWrap="wrap">
				{relevantTypes.map((type, index) => (
					<Box
						key={index}
						px={2}
						py={0.5}
						bg="accent.lavender.light"
						color="accent.lavender"
						fontSize="xs"
						borderRadius="full"
						fontWeight="500"
					>
						{type.replace(/_/g, " ")}
					</Box>
				))}
			</Flex>
		</Box>
	);
}
