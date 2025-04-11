import { ErrorResponseSchema } from "../api/restaurants/schemas.js";
import settings from "../core/config.js";

/**
 * Verifies a Google reCAPTCHA v3 token.
 * @param {string} token - The token from the frontend.
 * @param {string} secret - Your reCAPTCHA secret key.
 * @returns {Promise<object>} - The verification result from Google.
 */
async function verifyRecaptcha(token, secret) {
	const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
	const body = new URLSearchParams();
	body.append("secret", secret);
	body.append("response", token);
	try {
		const response = await fetch(verificationUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: body.toString(),
		});

		if (!response.ok) {
			console.error(`reCAPTCHA verification request failed: ${response.status} ${response.statusText}`);
			return { success: false, "error-codes": ["recaptcha-request-failed"] };
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error calling reCAPTCHA verify endpoint:", error);
		return { success: false, "error-codes": ["recaptcha-internal-error"] };
	}
}

/**
 * Creates Hono middleware for reCAPTCHA v3 verification.
 * @param {string} expectedAction - The expected action string for this route.
 * @param {number} [scoreThreshold=0.5] - The minimum acceptable score.
 */
export const createRecaptchaMiddleware = (expectedAction, scoreThreshold = 0.5) => {
	return async (c, next) => {
		if (!settings.RECAPTCHA_ENABLED) {
			console.warn("reCAPTCHA verification is disabled via RECAPTCHA_ENABLED=false in config/env");
			await next();
			return;
		}

		const token = c.req.header("X-Recaptcha-Token");

		if (!token) {
			console.warn("reCAPTCHA middleware: Token missing");
			return c.json(
				ErrorResponseSchema.parse({
					success: false,
					error: "reCAPTCHA token missing",
				}),
				400,
			);
		}

		const secret = settings.RECAPTCHA_SECRET_KEY;
		if (!secret) {
			console.error("reCAPTCHA middleware: Secret key is not configured (RECAPTCHA_SECRET_KEY missing).");
			return c.json(
				ErrorResponseSchema.parse({
					success: false,
					error: "Server configuration error (reCAPTCHA)",
				}),
				500,
			);
		}

		try {
			const verificationResult = await verifyRecaptcha(token, secret);

			if (!verificationResult.success) {
				console.warn("reCAPTCHA verification failed:", verificationResult["error-codes"]);
				return c.json(
					ErrorResponseSchema.parse({
						success: false,
						error: "reCAPTCHA verification failed",
					}),
					403,
				);
			}

			if (verificationResult.action !== expectedAction) {
				console.warn(`reCAPTCHA action mismatch: expected '${expectedAction}', got '${verificationResult.action}'`);
				return c.json(
					ErrorResponseSchema.parse({
						success: false,
						error: "reCAPTCHA action mismatch",
					}),
					400,
				);
			}

			if (verificationResult.score < scoreThreshold) {
				console.warn(
					`reCAPTCHA score below threshold: ${verificationResult.score} < ${scoreThreshold} for action '${expectedAction}'`,
				);
				return c.json(
					ErrorResponseSchema.parse({
						success: false,
						error: "Request potentially automated, verification score too low.",
					}),
					403,
				);
			}

			await next();
		} catch (error) {
			console.error("Internal error during reCAPTCHA middleware processing:", error);
			return c.json(
				ErrorResponseSchema.parse({
					success: false,
					error: "Internal server error during request verification",
				}),
				500,
			);
		}
	};
};
