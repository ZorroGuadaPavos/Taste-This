// backend/src/middleware/recaptcha.js

// TODO: This schema import might need adjustment depending on actual location/exports
import { ErrorResponseSchema } from "../api/restaurants/schemas.js";

// --- reCAPTCHA Verification Logic ---
const RECAPTCHA_SECRET_KEY = "6Ldc2gsrAAAAANDPpc2PFA6ZQlrq5NDB87ZnacV6"; // TODO: Replace with process.env.RECAPTCHA_SECRET_KEY in production!

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
	// Consider adding remoteip: body.append('remoteip', userIpAddress);

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
			// Return a structure indicating failure for the middleware to handle
			return { success: false, "error-codes": ["recaptcha-request-failed"] };
		}

		const data = await response.json();
		return data; // e.g., { success: true, score: 0.9, action: '...', ... }
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
		const token = c.req.header("X-Recaptcha-Token"); // Ensure frontend sends this header

		if (!token) {
			console.warn("reCAPTCHA middleware: Token missing");
			return c.json(
				ErrorResponseSchema.parse({
					success: false,
					error: "reCAPTCHA token missing",
				}),
				400, // Bad Request
			);
		}

		const secret = RECAPTCHA_SECRET_KEY; // Use the key defined above
		if (!secret) {
			console.error("reCAPTCHA middleware: Secret key is not configured.");
			return c.json(
				ErrorResponseSchema.parse({
					success: false,
					error: "Server configuration error (reCAPTCHA)",
				}),
				500, // Internal Server Error
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
						// Optionally include details: details: verificationResult['error-codes']
					}),
					403, // Forbidden
				);
			}

			if (verificationResult.action !== expectedAction) {
				console.warn(`reCAPTCHA action mismatch: expected '${expectedAction}', got '${verificationResult.action}'`);
				return c.json(
					ErrorResponseSchema.parse({
						success: false,
						error: "reCAPTCHA action mismatch",
					}),
					400, // Bad Request
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
					403, // Forbidden
				);
			}

			// Verification successful
			console.log(`reCAPTCHA success for action '${expectedAction}', score: ${verificationResult.score}`);
			await next();
		} catch (error) {
			// This catch is for unexpected errors within the middleware itself
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
