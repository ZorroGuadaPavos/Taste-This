# Taste This

No more wondering what to order!

https://taste-this.com find the most popular dishes at restaurants. By analyzing customer reviews, we identify the most recommended dishes, their ratings, and what people are saying about them. 

#### Your guide to the most recommended dishes.

## Technology Stack and Features

- **Backend:**
    - [**Bun**](https://bun.sh) for the JavaScript/TypeScript runtime.
        - [Hono](https://hono.dev) for the web framework.
        - [Zod](https://zod.dev) for data validation.
        - [OpenAPI](https://www.openapis.org) for API documentation.
- **Frontend:**
    - [**React**](https://react.dev) with TypeScript, hooks, and Vite for a modern frontend stack.
        - [Chakra UI](https://chakra-ui.com) for UI components.
        - [TanStack Router](https://tanstack.com/router) for routing.
        - [TanStack Query](https://tanstack.com/query) for data fetching.
        - Generated client for consuming the backend API.
- **AI Integration:**
    - [Google Generative AI](https://ai.google.dev) integration.

## Preview

<p align="center">
  <img src="preview.png" alt="Taste This Preview" width="500"/>
</p>

## Project Structure
```
.
├── backend/
│   ├── src/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Core configurations
│   │   ├── scraper/     # Data scraping functionality
│   │   ├── utils/       # Utility functions
│   │   └── main.js      # Application entry point
└── frontend/
    ├── src/
    │   ├── assets/      # Static assets
    │   ├── client/      # Generated API client
    │   ├── components/  # Reusable UI components
    │   ├── config/      # Configuration files
    │   ├── routes/      # Application routes
    │   ├── services/    # Service layer
    │   └── types/       # TypeScript type definitions
    └── public/          # Static assets
```

## Setup Instructions

### Backend Setup

1. Set up environment variables in `backend/.env` (you can copy from `.env.example`). Key variables include:
    * `MAPS_API_KEY`: Google Maps API key (required for fetching restaurant data).
    * `AI_API_KEY`: Google Generative AI API key (required for dish analysis).
    * `AI_MODEL`: The specific AI model to use (e.g., `gemini-pro`).
    * `POPULAR_DISHES_PROMPT`: The prompt template used for AI analysis.
    * `RECAPTCHA_SECRET_KEY`: Your Google reCAPTCHA v3 Secret Key.
    * `RECAPTCHA_ENABLED`: Set to `true` (default) or `false`. If set to `false`, backend reCAPTCHA verification will be skipped, useful for local testing without needing valid frontend tokens.

2. Navigate to the backend directory:
```bash
cd backend
```

3. Install dependencies:
```bash
bun install
```

4. Start the development server:
```bash
bun dev
```

The backend server will be available at the configured port.

### Frontend Setup

1. Navigate to the backend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the variables as needed

4. Start the development server:
```bash
pnpm run dev
```

5. The application will be available at `http://localhost:5173`

## Local Docker Execution & Deployment

### Running Backend Locally with Docker

These commands allow you to build and run the backend service within a Docker container, simulating the production environment more closely. Ensure you have a `.env` file configured in the `backend` directory.

1.  **Build the Docker image:**
    ```bash
    docker build -t taste-this-bun-local backend
    ```

2.  **Run the Docker container:**
    ```bash
    docker run --rm -p 3000:3000 --env-file backend/.env taste-this-bun-local bun src/main.js
    ```
    *   This command uses `bun src/main.js` as the entry point, which is suitable for local development/testing using the container but differs from the production entry point used in AWS Lambda (`bootstrap`).

### Deploying with Terraform

These commands manage the AWS infrastructure using Terraform.

1.  **Plan the changes:**
    ```bash
    terraform plan -var-file="secret.tfvars" -out=tfplan
    ```

2.  **Apply the changes:**
    ```bash
    terraform apply tfplan
    ```

## Contributing
1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## Acknowledgements
- [YasogaN/google-maps-review-scrape](https://github.com/YasogaN/google-maps-review-scraper) - Used as scraper implementation in this project.
