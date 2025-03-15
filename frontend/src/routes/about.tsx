import { Box, Container, Flex, Heading, Icon, Link, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { FaArrowLeft, FaCamera, FaCommentAlt, FaUtensils } from "react-icons/fa";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/about" as any)({
	component: AboutPage,
});

function AboutPage() {
	return (
		<Container maxW="container.lg" py={10} display="flex" minH="100dvh" flexDirection="column">
			<VStack gap={8} align="start" flex="1" px={8}>
				<Link
					href="/"
					display="flex"
					alignItems="center"
					mb={8}
					fontWeight="medium"
					color="accent.sakura"
					_hover={{ textDecoration: "none", color: "accent.sakura.dark" }}
					_focus={{ outline: "none" }}
				>
					<Icon as={FaArrowLeft} mr={2} />
					Back to home
				</Link>

				<Box>
					<Heading as="h1" size="2xl" mb={4} color="fg.DEFAULT">
						About Taste This
					</Heading>
					<Text fontSize="lg" color="fg.muted">
						Discover the most popular dishes at any restaurant based on real customer reviews.
					</Text>
				</Box>

				<Box borderBottomWidth="1px" borderColor="gray.200" width="100%" />

				<Box>
					<Heading as="h2" size="lg" mb={4} color="fg.DEFAULT">
						No more wondering what to order!
					</Heading>
					<Text color="fg.muted">
						Find the most popular dishes at restaurants. By analyzing customer reviews, we identify the most recommended
						dishes, their ratings, and what people are saying about them.
					</Text>
				</Box>

				<SimpleGrid columns={{ base: 1, md: 3 }} gap={6} width="100%">
					<FeatureCard
						icon={FaUtensils}
						title="Dish Recommendations"
						description="Get personalized dish recommendations based on actual customer experiences and ratings."
					/>
					<FeatureCard
						icon={FaCamera}
						title="Restaurant Insights"
						description="See details about restaurants to help you make informed dining decisions."
					/>
					<FeatureCard
						icon={FaCommentAlt}
						title="Review Excerpts"
						description="Read real customer comments about each dish to understand why it's popular."
					/>
				</SimpleGrid>

				<Box borderBottomWidth="1px" borderColor="gray.200" width="100%" />

				<Box width="100%">
					<Heading as="h2" size="lg" mb={4} color="fg.DEFAULT">
						How It Works
					</Heading>
					<VStack align="start" gap={4}>
						<Box>
							<Heading as="h3" size="md" mb={2} color="fg.DEFAULT">
								1. Search for a Restaurant
							</Heading>
							<Text color="fg.muted">Enter the name of any restaurant you're interested in exploring.</Text>
						</Box>
						<Box>
							<Heading as="h3" size="md" mb={2} color="fg.DEFAULT">
								2. Review Analysis
							</Heading>
							<Text color="fg.muted">
								Our system analyzes reviews to extract mentions of dishes and customer sentiment.
							</Text>
						</Box>
						<Box>
							<Heading as="h3" size="md" mb={2} color="fg.DEFAULT">
								3. Dish Recommendations
							</Heading>
							<Text color="fg.muted">
								We present you with a curated list of the most popular dishes, complete with ratings and excerpts from
								reviews.
							</Text>
						</Box>
					</VStack>
				</Box>

				<Box borderBottomWidth="1px" borderColor="gray.200" width="100%" />

				<Box width="100%">
					<Heading as="h2" size="lg" mb={4} color="fg.DEFAULT">
						Check out my other projects:
					</Heading>

					<Box pl={2} borderLeft="3px solid" borderColor="accent.sakura" mb={2}>
						<Link
							href="https://flash-notes.com"
							target="_blank"
							rel="noopener noreferrer"
							color="accent.sakura"
							fontWeight="medium"
							_hover={{ textDecoration: "none", color: "accent.sakura.dark" }}
						>
							Flash Notes
						</Link>
						<Text color="fg.muted" mt={1}>
							A modern flashcard tool for studying
						</Text>
					</Box>
				</Box>
			</VStack>
			<Footer />
		</Container>
	);
}

function FeatureCard({ icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
	return (
		<Box borderRadius="xl" boxShadow="sm" height="100%" p={4} borderWidth="1px" borderColor="gray.200">
			<Flex direction="column" align="center" textAlign="center">
				<Icon as={icon} boxSize={10} color="accent.sakura" mb={4} />
				<Heading as="h3" size="md" mb={2} color="fg.DEFAULT">
					{title}
				</Heading>
				<Text color="fg.muted">{description}</Text>
			</Flex>
		</Box>
	);
}
