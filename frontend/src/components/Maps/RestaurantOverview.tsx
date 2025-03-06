import { Box, Flex, Heading, Skeleton, Stack } from "@chakra-ui/react";
import { PlaceDataProvider, PlaceFieldLink, PlacePhotoGallery } from "@googlemaps/extended-component-library/react";
import { memo } from "react";
import type { Place } from "./RestaurantPicker";

function RestaurantOverviewComponent({ place }: { place: Place }) {
	return (
		<Flex w="100%" maxW="3xl" direction="column" justifyContent="center" display="flex">
			<PlaceDataProvider place={place.id}>
				<Heading as="h2" size="lg" mb={4} color="teal.600">
					Results for <PlaceFieldLink>{place.name}</PlaceFieldLink>
				</Heading>
				<Box slot="initial-loading">
					<Stack gap={4} mt={2}>
						<Skeleton height="20px" width="80%" />
						<Skeleton height="8rem" mb={4} borderRadius="md" />
					</Stack>
				</Box>
				<PlacePhotoGallery className="gallery" max-tiles="5" />
			</PlaceDataProvider>
		</Flex>
	);
}

export const RestaurantOverview = memo(RestaurantOverviewComponent, (prevProps, nextProps) => {
	return prevProps.place.id === nextProps.place.id;
});
