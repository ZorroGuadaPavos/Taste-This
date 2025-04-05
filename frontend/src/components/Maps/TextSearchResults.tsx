import type { Place } from "@/types/Place";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";

interface TextSearchResultsProps {
	places: Place[];
	onPlaceSelect: (place: Place) => void;
}

export function TextSearchResults({ places, onPlaceSelect }: TextSearchResultsProps) {
	if (!places || places.length === 0) {
		return (
			<Box textAlign="center" p={4} borderRadius="xl" bg="bg.box" boxShadow="sm" borderWidth="1px" borderColor="bg.200">
				<Text color="fg.muted">No places found. Try a different search term.</Text>
			</Box>
		);
	}

	return (
		<Box
			w="100%"
			maxW="2xl"
			borderWidth="1px"
			borderRadius="xl"
			overflow="hidden"
			bg="bg.box"
			boxShadow="sm"
			borderColor="bg.200"
		>
			<Box maxH="350px" overflowY="auto">
				{places.map((place, index) => (
					<Box key={place.id || index}>
						{index > 0 && <Box borderBottomWidth="1px" borderColor="bg.100" />}
						<Button
							variant="ghost"
							justifyContent="flex-start"
							alignItems="center"
							width="100%"
							py={3}
							px={4}
							onClick={() => onPlaceSelect(place)}
							_hover={{
								bg: "accent.matcha.light",
								color: "accent.matcha.dark",
							}}
							_active={{ bg: "accent.matcha.light" }}
							borderRadius={0}
							height="auto"
							minH="unset"
							transition="all 0.2s"
						>
							<Flex align="center" width="100%">
								<Box color="accent.sakura" mr={3} fontSize="sm">
									<FaMapMarkerAlt />
								</Box>
								<Box textAlign="left">
									<Text fontWeight="500" color="fg.DEFAULT" fontSize="sm">
										{place.name}
									</Text>
									<Text fontSize="xs" color="fg.muted" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
										{place.address}
									</Text>
								</Box>
							</Flex>
						</Button>
					</Box>
				))}
			</Box>
		</Box>
	);
}
