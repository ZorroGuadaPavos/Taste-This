import { Box, Flex, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { MdSearchOff } from "react-icons/md";

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
			p={6}
			borderRadius="xl"
			bg={isNotFound ? "bg.50" : "bg.50"}
			borderWidth="1px"
			borderColor={isNotFound ? "accent.matcha.light" : "accent.pink.dark"}
			borderLeftWidth="4px"
			boxShadow="sm"
		>
			<Flex align="center" mb={4}>
				<Icon
					as={isNotFound ? MdSearchOff : HiOutlineExclamationCircle}
					color={isNotFound ? "accent.matcha.dark" : "accent.sakura"}
					boxSize={6}
					mr={3}
				/>
				<Heading as="h3" size="md" color={isNotFound ? "accent.matcha.dark" : "accent.pink.dark"} fontWeight="600">
					{isNotFound ? "Restaurant Not Found" : "Oops! Something went wrong"}
				</Heading>
			</Flex>
			<VStack align="start" gap={2} pl={9}>
				{messageLines.map((line) =>
					line ? (
						<Text key={`error-line-${line.substring(0, 10)}`} color="fg.muted" fontSize="sm">
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
