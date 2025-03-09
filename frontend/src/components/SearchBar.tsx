import { Box, Input, Spinner } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
	restaurant: string;
	setRestaurant: (value: string) => void;
	handleSearch: () => void;
	isLoading: boolean;
}

export function SearchBar({ restaurant, setRestaurant, handleSearch, isLoading }: SearchBarProps) {
	const isEmpty = !restaurant.trim();

	return (
		<Box w="100%" maxW="2xl">
			<Box position="relative">
				<Box position="absolute" left="1rem" top="50%" transform="translateY(-50%)" color="gray.500" zIndex="1">
					<FaSearch />
				</Box>
				<Input
					placeholder="Search for restaurants or food types..."
					size="lg"
					value={restaurant}
					onChange={(e) => setRestaurant(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && !isEmpty && handleSearch()}
					bg="white"
					pl="2.5rem"
					borderRadius="md"
					borderWidth="2px"
					borderColor="gray.300"
					_focus={{
						outline: "none",
						borderColor: "teal.400",
					}}
					_placeholder={{
						color: "gray.500",
						fontSize: "sm",
						fontWeight: "normal",
					}}
					fontSize="sm"
					fontWeight="medium"
					color="gray.800"
					h="3rem"
					disabled={isLoading}
					opacity={isLoading ? 0.7 : 1}
					cursor={isLoading ? "not-allowed" : "text"}
					boxShadow="md"
				/>
				{isLoading && (
					<Box position="absolute" right="1rem" top="50%" transform="translateY(-50%)" color="teal.500">
						<Spinner size="sm" color="teal.600" />
					</Box>
				)}
			</Box>
		</Box>
	);
}
