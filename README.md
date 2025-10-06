# SpeakHire Backend

This is the backend for the SpeakHire video-based recruitment platform, built with Node.js, Express.js, and MySQL.

## Features

- User Authentication (Signup, Login) with JWT
- Video Upload for Candidates
- FFmpeg Integration for Audio Extraction from Videos
- Speech-to-Text Integration (OpenAI Whisper)
- Fluency Score Calculation
- Role Categorization based on Transcript Keywords
- Candidate Dashboard API to view their video analysis results
- Recruiter Dashboard API to view all candidates and their insights
- Local storage for videos and audio files

## Tech Stack

- **Node.js**
- **Express.js**
- **MySQL**
- **Multer** for file uploads
- **fluent-ffmpeg** for video/audio processing
- **OpenAI Node.js library** for Speech-to-Text (Whisper API)
- **bcryptjs** for password hashing
- **jsonwebtoken** for authentication
- **dotenv** for environment variables

## Setup Instructions

Follow these steps to get the SpeakHire backend running locally.

### 1. Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MySQL Server
- FFmpeg: Ensure FFmpeg is installed on your system and accessible via your PATH. You can download it from [ffmpeg.org](https://ffmpeg.org/download.html).
- OpenAI API Key: Required for the Speech-to-Text service.

### 2. Clone the Repository (or extract the zip file)

If you received this as a zip file, extract it to your desired directory. If it were a repository, you would clone it:

```bash
git clone <repository-url>
cd speak-hire-backend
```

### 3. Install Dependencies

Navigate to the project directory and install the required Node.js packages:

```bash
npm install
```

### 4. Database Setup

1.  **Create a MySQL Database**: Log in to your MySQL server and create a new database for SpeakHire. For example:

    ```sql
    CREATE DATABASE speak_hire;
    ```

2.  **Create Tables**: Use the provided SQL script to create the `users` and `videos` tables. You can execute this script using a MySQL client 

    ```sql
    USE speak_hire;
    
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM("candidate", "recruiter") NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        video_path VARCHAR(255) NOT NULL,
        audio_path VARCHAR(255) NOT NULL,
        transcript TEXT,
        fluency_score DECIMAL(5,2),
        categorized_role VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    ```

### 5. Environment Variables

Create a `.env` file in the root of the `speak-hire-backend` directory based on the `.env.example` file. Fill in your database credentials and OpenAI API key.

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=speak_hire
JWT_SECRET=your_very_secret_jwt_key_here
OPENAI_API_KEY=sk-your_openai_api_key_here
```

-   `PORT`: The port your Express server will run on.
-   `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Your MySQL database connection details.
-   `JWT_SECRET`: A strong, random string used to sign and verify JWT tokens. Generate a complex one.
-   `OPENAI_API_KEY`: Your API key from OpenAI for the Whisper Speech-to-Text service.

### 6. Run the Backend Server

```bash
node server.js
```

The server should start and listen on the port specified in your `.env` file (default: 3000).

## API Endpoints

Base URL: `http://localhost:3000/api` (or your configured port)

### Authentication

-   `POST /auth/signup`
    -   **Body**: `{ "name": "string", "email": "string", "password": "string", "role": "candidate" | "recruiter" }`
    -   **Description**: Register a new user.
-   `POST /auth/login`
    -   **Body**: `{ "email": "string", "password": "string" }`
    -   **Description**: Log in a user and receive a JWT token.

### Video Upload (Candidate)

-   `POST /video/upload`
    -   **Headers**: `x-access-token: <JWT_TOKEN>`
    -   **Body**: `multipart/form-data` with a field named `video` containing the video file.
    -   **Description**: Candidate uploads a video resume. The backend will process it asynchronously.

### Candidate Dashboard

-   `GET /candidate/videos`
    -   **Headers**: `x-access-token: <JWT_TOKEN>` (must be a candidate token)
    -   **Description**: Get all video analysis results for the logged-in candidate.

### Recruiter Dashboard

-   `GET /recruiter/candidates`
    -   **Headers**: `x-access-token: <JWT_TOKEN>` (must be a recruiter token)
    -   **Description**: Get a list of all candidates with their video analysis results.

## Project Structure

```
speak-hire-backend/
├── config/
│   ├── db.config.js          # Database connection pool
│   └── create_tables.sql     # SQL script for table creation
├── controllers/
│   ├── auth.controller.js    # Handles user signup/login logic
│   ├── candidate.controller.js # Logic for candidate-specific data
│   ├── recruiter.controller.js # Logic for recruiter-specific data
│   └── video.controller.js   # Handles video upload and processing initiation
├── middleware/
│   ├── auth.middleware.js    # JWT verification and role-based authorization
│   └── upload.middleware.js  # Multer configuration for video uploads
├── models/
│   ├── user.model.js         # MySQL queries for users table
│   └── video.model.js        # MySQL queries for videos table
├── routes/
│   ├── auth.routes.js        # API routes for authentication
│   ├── candidate.routes.js   # API routes for candidate dashboard
│   ├── recruiter.routes.js   # API routes for recruiter dashboard
│   └── video.routes.js       # API routes for video uploads
├── services/
│   ├── ffmpeg.service.js     # FFmpeg wrapper for audio extraction
│   ├── fluency.service.js    # Fluency score calculation logic
│   ├── roleCategorization.service.js # Role categorization logic
│   └── stt.service.js        # Speech-to-Text (OpenAI Whisper) integration
├── uploads/
│   ├── audio/                # Directory for extracted audio files
│   └── videos/               # Directory for uploaded video files
├── .env.example              # Example environment variables file
├── package.json              # Project dependencies and scripts
└── server.js                 # Main Express application file
```

## Important Notes

-   **FFmpeg**: Ensure FFmpeg is correctly installed and its binaries are in your system's PATH. If not, you might need to uncomment and set `ffmpeg.setFfmpegPath()` and `ffmpeg.setFfprobePath()` in `services/ffmpeg.service.js`.
-   **Asynchronous Processing**: Video processing (audio extraction, STT, analysis) happens asynchronously after upload. The API response for video upload will indicate that processing has started, but the results (transcript, score, role) will be updated in the database later. The frontend should poll or use websockets to get real-time updates (though polling is simpler for this example).
-   **Error Handling**: Basic error handling is included. For a production application, more robust error logging and handling mechanisms would be recommended.
-   **Security**: This project includes basic security measures like password hashing and JWT. Always follow best practices for production deployments, including secure configuration, input sanitization, and regular security audits.

