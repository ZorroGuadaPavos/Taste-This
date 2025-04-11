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
				const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

				if (!siteKey) {
					console.error("VITE_RECAPTCHA_SITE_KEY is not defined in .env.local (or other .env file).");
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

declare global {
	interface Window {
		grecaptcha: {
			ready: (callback: () => void) => void;
			execute: (siteKey: string, options: { action: string }) => Promise<string>;
		};
	}
}
