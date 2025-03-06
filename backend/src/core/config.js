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
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  POPULAR_DISHES_PROMPT: process.env.POPULAR_DISHES_PROMPT,
};

if (!settings.OPENAI_API_KEY) {
  console.warn("Warning: OPENAI_API_KEY is not set. Analysis will not work.");
}

if (!settings.POPULAR_DISHES_PROMPT) {
  console.warn("Warning: POPULAR_DISHES_PROMPT is not set. Analysis will not work properly.");
}

if (!settings.OPENAI_MODEL) {
  console.warn("Warning: OPENAI_MODEL is not set. Analysis will not work properly.");
}

export default settings;
