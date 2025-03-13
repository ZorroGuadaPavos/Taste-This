import { Box, HStack, Icon, Text } from "@chakra-ui/react";
import { FiInfo } from "react-icons/fi";

interface ErrorMessageProps {
	message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
	return (
		<Box
			w="100%"
			maxW="2xl"
			borderWidth="1px"
			borderRadius="xl"
			overflow="hidden"
			borderColor="accent.pink.dark"
			bg="bg.50"
			p={4}
		>
			<HStack>
				<Icon as={FiInfo} color="accent.pink.dark" boxSize={5} />
				<Text color="accent.pink.dark">{message}</Text>
			</HStack>
		</Box>
	);
}
