import { Box, Flex, Link, Text } from "@chakra-ui/react";
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
					<Link color="accent.sakura" href="/about" _focus={{ outline: "none" }}>
						About
					</Link>
					<Box as="span" mx={2} fontSize="xs">
						•
					</Box>
					<Link
						color="accent.sakura"
						href="https://github.com/ZorroGuadaPavos/Taste-This"
						target="_blank"
						rel="noopener noreferrer"
						_focus={{ outline: "none" }}
						display="inline-flex"
						alignItems="center"
					>
						<ImGithub style={{ marginRight: "4px" }} />
						GitHub
					</Link>
				</Text>
			</Flex>
		</Box>
	);
}
