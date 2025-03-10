import { Container } from "@chakra-ui/react";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
	component: Layout,
});

function Layout() {
	return (
		<>
			<Container pt={{ base: "4rem", md: "6rem" }}>
				<Outlet />
			</Container>
		</>
	);
}
