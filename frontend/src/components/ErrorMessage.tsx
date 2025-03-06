import { Box, Flex, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { FaExclamationTriangle, FaSearch } from "react-icons/fa";

interface ErrorMessageProps {
	message: string;
	type?: "notFound" | "error";
}

export function ErrorMessage({ message, type = "error" }: ErrorMessageProps) {
	const isNotFound = type === "notFound";

	const messageLines = message.split("\n");

	return (
		<Box
			w="100%"
			maxW="2xl"
			mt={6}
			p={5}
			borderRadius="md"
			bg={isNotFound ? "orange.50" : "red.50"}
			borderWidth="1px"
			borderColor={isNotFound ? "orange.200" : "red.200"}
			transition="all 0.3s ease"
		>
			<Flex align="center" mb={3}>
				<Icon
					as={isNotFound ? FaSearch : FaExclamationTriangle}
					color={isNotFound ? "orange.500" : "red.500"}
					boxSize={5}
					mr={2}
				/>
				<Heading as="h3" size="md" color={isNotFound ? "orange.600" : "red.600"}>
					{isNotFound ? "Restaurant Not Found" : "Oops! Something went wrong"}
				</Heading>
			</Flex>
			<VStack align="start" gap={2}>
				{messageLines.map((line) =>
					line ? (
						<Text key={`error-line-${line.substring(0, 10)}`} color="gray.700">
							{line}
						</Text>
					) : (
						<Box key="empty-line" h="0.5rem" />
					),
				)}
			</VStack>
		</Box>
	);
}
