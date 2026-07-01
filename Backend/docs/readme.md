# Uber Clone Backend

This is the backend service for the Uber Clone application. It provides the RESTful API for user authentication, ride management, and real-time location tracking.

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** (with Mongoose)
- **JWT** (for Authentication)
- **Bcrypt** (for Password Hashing)
- **Cookie Parser** (for securely handling JWT in cookies)

## Prerequisites

- Node.js installed on your machine
- MongoDB instance (local or Atlas)

## Installation

1. Clone the repository and navigate to the backend folder:

   ```bash
   cd Backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the `Backend` directory and add the following variables:

```env
PORT=3000
DB_CONNECT=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## Running the Application

To start the server in development mode (using nodemon):

```bash
npm start
```

The server will run on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Auth Routes (`/api/auth`)
- `POST /register`: Register a new user.
- `POST /login`: Login a user, generates a JWT, and sets it in an HTTP-only cookie.
- `GET /profile`: Get the authenticated user's profile (Requires valid JWT token).
- `POST /logout`: Logout the user by blacklisting their token and clearing the cookie.

## Project Structure

- `src/models/`: Mongoose schemas (e.g., User Model, Blacklist Model)
- `src/Controlers/`: Route controllers handling the business logic
- `src/Routes/`: Express API routes
- `src/middlewares/`: Custom middlewares (e.g., Authentication and Token validation)
- `src/Databse/`: Database connection setup
