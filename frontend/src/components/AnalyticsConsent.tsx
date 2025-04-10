import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import posthog from "posthog-js";
import { useEffect, useState } from "react";

const CONSENT_KEY = "analytics_consent";

export const AnalyticsConsent = () => {
	const [consentGiven, setConsentGiven] = useState<boolean | null>(null);
	const { open, onClose } = useDisclosure({ defaultOpen: true });

	useEffect(() => {
		const storedConsent = localStorage.getItem(CONSENT_KEY);
		if (storedConsent === "true") {
			setConsentGiven(true);
			initializeAnalytics();
		} else if (storedConsent === "false") {
			setConsentGiven(false);
		} else {
			setConsentGiven(null);
		}
	}, []);

	const initializeAnalytics = () => {
		if (import.meta.env.PROD && import.meta.env.VITE_PUBLIC_POSTHOG_KEY && import.meta.env.VITE_PUBLIC_POSTHOG_HOST) {
			posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
				api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
			});
		}
	};

	const handleAccept = () => {
		localStorage.setItem(CONSENT_KEY, "true");
		setConsentGiven(true);
		initializeAnalytics();
		onClose();
	};

	const handleDecline = () => {
		localStorage.setItem(CONSENT_KEY, "false");
		setConsentGiven(false);
		onClose();
	};

	if (consentGiven !== null) {
		return null;
	}

	if (!open) {
		return null;
	}

	return (
		<Box
			position="fixed"
			top="0"
			left="0"
			right="0"
			bottom="0"
			bg="blackAlpha.500"
			zIndex="overlay"
			display="flex"
			alignItems="flex-end"
			justifyContent="center"
		>
			<Box
				width="100%"
				bg="bg.100"
				color="fg"
				p={4}
				zIndex="banner"
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Text fontSize="sm" mr={4}>
					We use analytics cookies to understand how you use our service and to make improvements.
				</Text>
				<Box>
					<Button
						size="sm"
						bg="cookie.decline"
						color="gray.700"
						onClick={handleDecline}
						mr={2}
						_hover={{ bg: "gray.300" }}
					>
						Decline
					</Button>
					<Button size="sm" bg="cookie.accept" color="white" onClick={handleAccept} _hover={{ opacity: 0.9 }}>
						Accept
					</Button>
				</Box>
			</Box>
		</Box>
	);
};
