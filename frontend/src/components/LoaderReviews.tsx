import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { GiBowlOfRice, GiChopsticks, GiCupcake, GiSushis } from "react-icons/gi";

// Create animation keyframes
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const appear = keyframes`
  0%, 20% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

export function LoaderReviews() {
	return (
		<Center w="100%" maxW="2xl">
			<Flex
				direction="column"
				align="center"
				bg="bg.50"
				py={6}
				px={8}
				borderRadius="xl"
				borderWidth="1px"
				w="100%"
				borderColor="accent.sakura"
				boxShadow="0 4px 8px rgba(0,0,0,0.05)"
			>
				<Flex gap={4} mb={5} position="relative">
					<Box
						as={GiBowlOfRice}
						fontSize="2rem"
						color="accent.matcha.dark"
						animation={`${bounce} 1.5s ease-in-out infinite`}
						animationDelay="0s"
					/>
					<Box
						as={GiChopsticks}
						fontSize="2rem"
						color="accent.pink"
						animation={`${bounce} 2s linear infinite`}
						animationDelay="0.2s"
						transformOrigin="center 70%"
					/>
					<Box
						as={GiSushis}
						fontSize="2rem"
						color="accent.lavender"
						animation={`${bounce} 1.5s ease-in-out infinite`}
						animationDelay="0.4s"
					/>
					<Box
						as={GiCupcake}
						fontSize="2rem"
						color="accent.sakura"
						animation={`${bounce} 1.5s ease-in-out infinite`}
						animationDelay="0.6s"
					/>
				</Flex>

				<Text color="fg.DEFAULT" fontWeight="600" fontSize="md" animation={`${appear} 0.6s ease-out forwards`}>
					Finding tasty dishes...
				</Text>

				<Box
					fontSize="sm"
					color="fg.muted"
					mt={2}
					animation={`${appear} 0.6s ease-out forwards`}
					animationDelay="0.3s"
					textAlign="center"
				>
					We're analyzing reviews to serve up
					<br />
					the most popular recommendations
				</Box>
			</Flex>
		</Center>
	);
}
