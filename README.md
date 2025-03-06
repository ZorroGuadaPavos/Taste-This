# Taste This

#### A simple application for exploring and discovering places to eat.

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
    - [LangChain](https://js.langchain.com) for AI capabilities.
    - [Google Generative AI](https://ai.google.dev) integration.

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

1. Set up environment variables in `backend/.env` (you can copy from `.env.example`):

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

1. Install dependencies and start the development server:
```bash
cd frontend
pnpm install
pnpm run dev
```

2. The frontend development server will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Generate Frontend API Client

The frontend uses a generated TypeScript client to communicate with the backend API. To update the client after making changes to the backend:

1. Download the OpenAPI specification from the backend:
   - Make sure your backend server is running
   - Download the openapi.json file from http://localhost:3000/docs and place it in the frontend root directory

2. Generate the client:
```bash
cd frontend
pnpm run generate-client
```

## API Documentation
Once the backend is running, access the interactive API documentation at the Swagger UI endpoint.

## Contributing
1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## License
This project is licensed under the MIT License.
