import { Center, Spinner, Text } from "@chakra-ui/react";

export function LoadingIndicator() {
	return (
		<Center p={10}>
			<Spinner size="xl" color="teal.500" />
			<Text ml={4}>Analyzing reviews...</Text>
		</Center>
	);
}
