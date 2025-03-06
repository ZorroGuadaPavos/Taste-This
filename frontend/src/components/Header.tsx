import { Flex, Heading, Text } from "@chakra-ui/react";
import { FaUtensils } from "react-icons/fa";

export function Header() {
	return (
		<>
			<Heading as="h1" size="2xl" textAlign="center" color="teal.700">
				<Flex align="center">
					<FaUtensils style={{ marginRight: "10px" }} />
					TasteThis!
				</Flex>
			</Heading>

			<Text fontSize="xl" textAlign="center" color="gray.600">
				Discover the best dishes at any restaurant based on real customer reviews
			</Text>
		</>
	);
}
