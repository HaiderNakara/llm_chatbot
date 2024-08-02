# AI Chatbot Microservices

This project consists of two microservices: a NestJS application and a FastAPI application, containerized and orchestrated using Docker Compose.

## Project Structure

```
.
├── docker-compose.yml
├── llm_nest/
│   ├── Dockerfile
│   └── .env
└── llm_fastapi/
    ├── Dockerfile
    └── .env
```

## Prerequisites

- Docker
- Docker Compose

## Setup and Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Set up environment variables:
   - In `llm_fastapi/.env`, add:
     ```
     FASTAPI_URL=http://fastapi_app:8000
     GROQ_API_KEY=your_groq_api_key
     MISTRAL_API_KEY=your_mistral_api_key
     ```
   - In `llm_nest/.env`, add:
     ```
     MONGO_DB=your_mongodb_connection_string
     ```
   
   Make sure to replace `your_groq_api_key`, `your_mistral_api_key`, and `your_mongodb_connection_string` with your actual API keys and MongoDB connection string.

3. Build and start the containers:
   ```
   docker-compose up --build
   ```

## Usage

Once the containers are up and running:

- NestJS application will be available at: `http://localhost:3000`
- FastAPI application will be available at: `http://localhost:8000`

You can access the NestJS API documentation at: `http://localhost:3000/api/docs`

## Services

### NestJS Application

- Port: 3000
- API Documentation: Available at `/api/docs`
- Required Environment Variables:
  - `MONGO_DB`: MongoDB connection string

### FastAPI Application

- Port: 8000
- Required Environment Variables:
  - `GROQ_API_KEY`: API key for GROQ service
  - `MISTRAL_API_KEY`: API key for Mistral service

## Troubleshooting

If you encounter connection issues between services:

1. Ensure both services are on the same Docker network (app_network).
2. Verify that the NestJS service is using the correct URL to connect to the FastAPI service (`http://fastapi_app:8000`).
3. Check if both services are running correctly within their containers.
4. Verify that all required environment variables are correctly set in the respective `.env` files.

