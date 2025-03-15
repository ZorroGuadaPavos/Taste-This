import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { ImGithub } from "react-icons/im";

export function Footer() {
	return (
		<Box as="footer" py={3} mt={8} borderTop="1px solid" borderColor="bg.200">
			<Flex justify="center" align="center">
				<Text fontSize="sm" color="fg.muted" display="flex" alignItems="center">
					© {new Date().getFullYear()} TasteThis!
					<Box as="span" mx={2} fontSize="xs">
						•
					</Box>
					<Link color="accent.sakura" to="/about">
						About
					</Link>
					<Box as="span" mx={2} fontSize="xs">
						•
					</Box>
					<a
						color="accent.sakura"
						href="https://github.com/ZorroGuadaPavos/Taste-This"
						target="_blank"
						rel="noopener noreferrer"
						style={{ display: "flex", alignItems: "center" }}
					>
						<ImGithub style={{ marginRight: "4px" }} />
						GitHub
					</a>
				</Text>
			</Flex>
		</Box>
	);
}
