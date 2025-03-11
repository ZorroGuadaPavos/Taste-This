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
		<Box w="100%" maxW="2xl" mb={6}>
			<Box position="relative">
				<Box position="absolute" left="1rem" top="50%" transform="translateY(-50%)" color="accent.matcha" zIndex="1">
					<FaSearch />
				</Box>
				<Input
					placeholder="Search for restaurants or food types..."
					size="lg"
					value={restaurant}
					onChange={(e) => setRestaurant(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && !isEmpty && handleSearch()}
					bg="bg.input"
					pl="2.5rem"
					borderRadius="full"
					borderWidth="2px"
					borderColor="bg.200"
					_focus={{
						outline: "none",
						borderColor: "accent.lavender",
						boxShadow: "0 0 0 1px rgba(200, 162, 212, 0.5)",
					}}
					_hover={{
						borderColor: "accent.lavender.light",
					}}
					_placeholder={{
						color: "fg.muted",
						fontSize: "sm",
						fontWeight: "normal",
					}}
					fontSize="md"
					fontWeight="medium"
					color="fg.DEFAULT"
					h="3.2rem"
					disabled={isLoading}
					opacity={isLoading ? 0.7 : 1}
					cursor={isLoading ? "not-allowed" : "text"}
					boxShadow="sm"
				/>
				{isLoading && (
					<Box position="absolute" right="1rem" top="50%" transform="translateY(-50%)" color="accent.lavender">
						<Spinner size="sm" color="accent.lavender" />
					</Box>
				)}
			</Box>
		</Box>
	);
}
