// import { GiCupcake } from "react-icons/gi";
import Logo from "@/assets/logo.png";
import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

export function Header() {
	return (
		<Box mb={8} textAlign="center">
			<Heading as="h1" size="2xl" fontWeight="700" color="accent.matcha.dark" mb={3}>
				<Flex align="center" justify="center">
					<Image src={Logo} alt="Logo" width="2em" mr={2} transform="rotate(-10deg)" />
					TasteThis!
				</Flex>
			</Heading>

			<Text
				fontSize="lg"
				fontWeight="500"
				color="fg.muted"
				maxW="md"
				mx="auto"
				px={4}
				borderRadius="full"
				py={1}
				bg="bg.50"
			>
				Discover the best dishes at any restaurant based on real customer reviews
			</Text>
		</Box>
	);
}
