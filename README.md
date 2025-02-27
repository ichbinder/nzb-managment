# NZB Management API

A RESTful API for managing and accessing movie NZB files. This application provides secure endpoints for retrieving movie information and associated NZB files through authenticated routes.

## Features

- User authentication with JWT
- Movie information retrieval by TMDB ID
- NZB file access by unique hash
- MongoDB integration for data storage
- Secure API with TLS certificate support
- MongoDB transport encryption for enhanced security

## Technology Stack

- Node.js and Express
- TypeScript
- MongoDB
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v14+ recommended)
- MongoDB server
- TLS certificates for MongoDB transport encryption

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/nzbManagment.git
   cd nzbManagment
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   PORT=<your_preferred_port>
   MONGODB_URI=<your_mongodb_connection_string>
   TLS_CA_FILE=<path_to_ca_certificate>
   TLS_CLIENT_FILE=<path_to_client_certificate>
   TOKEN_SECRET=<your_jwt_secret>
   ADMIN_DEFAULT_PASSWORD=<default_admin_password>
   ```

4. Create certificates directory:
   ```
   mkdir -p cert
   ```
   Place your CA and client certificates in this directory. These certificates are used for securing the MongoDB connection with transport encryption.

## Usage

### Starting the server

Development mode:

```
npm run dev
```

Production mode:

```
npm start
```

### Creating an admin user

```
npm run create-admin
```

### API Endpoints

#### Authentication

- POST `/user/login` - Authenticate a user and get JWT token
- POST `/user/register` - Register a new user (Admin only)

#### Movies

- GET `/movies/:tmdbID` - Get movie information by TMDB ID
- GET `/movies/version/:hash` - Get NZB file by hash

## Database Structure

The API uses MongoDB with the following collections:

- `users` - User credentials and roles
- `movies` - Movie information and NZB file data

## Security

This application implements:

- JWT authentication
- Password hashing with bcrypt
- MongoDB transport encryption using TLS certificates
- Secure API communication

## License

This project is licensed under the terms included in the LICENSE file.
