import { Box, Flex, Text } from "@chakra-ui/react";

interface CategoriesProps {
	types: string[];
}

export function Categories({ types }: CategoriesProps) {
	if (!types || types.length === 0) return null;

	return (
		<Box width="100%">
			<Text fontSize="sm" color="fg.muted" mb={2}>
				Categories
			</Text>
			<Flex gap={2} flexWrap="wrap">
				{types.map((type, index) => (
					<Box
						key={index}
						px={3}
						py={1}
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
