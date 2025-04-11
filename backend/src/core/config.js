function parseCors(value) {
	if (typeof value === "string" && !value.startsWith("[")) {
		return value.split(",").map((item) => item.trim());
	}
	if (Array.isArray(value) || typeof value === "string") {
		return value;
	}
	throw new Error("Invalid CORS configuration");
}

const settings = {
	API_V1_STR: "/api/v1",
	BACKEND_CORS_ORIGINS: parseCors(process.env.BACKEND_CORS_ORIGINS || []),
	PORT: process.env.PORT || 3000,

	MAPS_API_KEY: process.env.MAPS_API_KEY,

	AI_API_KEY: process.env.AI_API_KEY,
	AI_MODEL: process.env.AI_MODEL,

	POPULAR_DISHES_PROMPT: process.env.POPULAR_DISHES_PROMPT,

	RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
	RECAPTCHA_ENABLED: process.env.RECAPTCHA_ENABLED !== "false",
};

if (!settings.MAPS_API_KEY) {
	console.warn("Warning: MAPS_API_KEY is not set.");
}

if (!settings.AI_API_KEY) {
	console.warn("Warning: AI_API_KEY is not set. Analysis will not work.");
}

if (!settings.POPULAR_DISHES_PROMPT) {
	console.warn("Warning: POPULAR_DISHES_PROMPT is not set. Analysis will not work properly.");
}

if (!settings.AI_MODEL) {
	console.warn("Warning: AI_MODEL is not set. Analysis will not work properly.");
}

if (!settings.RECAPTCHA_SECRET_KEY && settings.RECAPTCHA_ENABLED) {
	console.warn("Warning: RECAPTCHA_SECRET_KEY is not set, but reCAPTCHA is enabled. Verification will fail.");
}

export default settings;
