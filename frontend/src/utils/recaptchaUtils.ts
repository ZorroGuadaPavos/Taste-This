/**
 * Executes Google reCAPTCHA v3 and returns the token.
 * @param action The action name for reCAPTCHA.
 * @returns A promise that resolves with the reCAPTCHA token.
 * @throws An error if reCAPTCHA is not ready or execution fails.
 */
export const getRecaptchaToken = (action: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		if (typeof window.grecaptcha === "undefined" || typeof window.grecaptcha.execute === "undefined") {
			console.error("reCAPTCHA script not loaded yet.");
			reject(new Error("reCAPTCHA script not loaded yet."));
			return;
		}

		window.grecaptcha.ready(() => {
			try {
				// IMPORTANT: Replace 'YOUR_SITE_KEY' with your actual site key
				const siteKey = "6Ldc2gsrAAAAACZ9z7araIQHHyhy2REPNT6bbOjF"; // Use the key provided
				if (!siteKey) {
					console.error("VITE_RECAPTCHA_SITE_KEY is not defined.");
					reject(new Error("reCAPTCHA Site Key is missing."));
					return;
				}

				window.grecaptcha.execute(siteKey, { action: action }).then(
					(token) => {
						resolve(token);
					},
					(error) => {
						console.error("reCAPTCHA execution failed:", error);
						reject(new Error("reCAPTCHA execution failed"));
					},
				);
			} catch (error) {
				console.error("Error executing reCAPTCHA:", error);
				reject(error);
			}
		});
	});
};

// Add type definition for grecaptcha if it doesn't exist globally
declare global {
	interface Window {
		grecaptcha: {
			ready: (callback: () => void) => void;
			execute: (siteKey: string, options: { action: string }) => Promise<string>;
		};
	}
}
