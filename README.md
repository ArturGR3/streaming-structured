# Streaming Structured Output with PydanticAI & FastAPI: Real-Time JSON with Lower Latency

## Prerequisites

- Python 3.9+ 
- [uv](https://docs.astral.sh/uv/) (for Python dependency management)
- Node.js and npm (for frontend)

## Getting Started

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies using uv:**
   ```bash
   uv sync
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory and add your OpenAI API key:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the backend server:**
   ```bash
   uv run python main_pydentic_ai.py
   ```

   The backend will start on `http://localhost:8001`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## Usage

1. Make sure both backend and frontend servers are running
2. Open your browser and go to `http://localhost:3000`
3. Upload or paste a resume text to see the structured parsing with real-time streaming

## API Endpoint

- **POST** `/parse-resume` - Streams structured resume data as Server-Sent Events (SSE)

## Tech Stack

- **Backend:** FastAPI, PydanticAI, OpenAI GPT-4
- **Frontend:** React, TypeScript, Tailwind CSS
- **Package Management:** uv (Python), npm (JavaScript) 