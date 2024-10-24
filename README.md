# Carpooling Service Project

## Project Overview

This is a personal project aimed at creating a carpooling service to tackles the problem of transportation cost for mobile and non mobile individuals, groups and organizations. The project involves both frontend and backend development, with a focus on providing a seamless and secure experience for users. The backend is built using TypeScript, Express, and MongoDB, with several other libraries and tools for handling various aspects of the application.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technologies Used](#technologies-used)
3. [API Documentation](#api-documentation)
4. [Installation](#installation)
5. [Scripts](#scripts)
6. [Environment Variables](#environment-variables)
7. [License](#license)

## Project Structure

```plaintext
.
├── src
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── utils
│   ├── server.ts
│   └── ...
├── .husky
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── package.json
└── README.md
```

- **controllers**: Handles the business logic for the application.
- **middlewares**: Contains custom middleware for request handling and validation.
- **models**: Defines the MongoDB schemas using Mongoose.
- **routes**: Contains all the API route definitions.
- **utils**: Utility functions used throughout the project.
- **server.ts**: The entry point of the backend server.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **MongoDB**: NoSQL database for storing user data, rides, and other entities.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **JWT**: JSON Web Token for secure authentication.
- **Joi**: Schema description language and validator for JavaScript objects.
- **Helmet**: Helps secure Express apps by setting various HTTP headers.
- **Multer**: Node.js middleware for handling multipart/form-data, used for file uploads.
- **AWS S3 PACKAGES**: S3 Bucket for storing files
- **Cloudinary**: Cloud service that offers a solution for image and video management.
- **Ngrok**: Secure introspectable tunnels to localhost, useful for testing webhooks.
- **Jest**: JavaScript testing framework.
- **Prettier**: Code formatter.
- **ESLint**: Pluggable linting utility for JavaScript and TypeScript.

## API Documentation

### AVAILABLE Endpoints (_ Will be updated as I progress_)

- **POST /api/users/**: Registers a new user.
- **POST /api/users/login**: Logs in a user and returns a JWT.
- **PUT /api/users/:id**: Update User details.
- **PUT /api/users/**: GET all users (optional query params allowed).
- **PUT /api/users/:id**: GET user by id.
- **DELETE /api/users/:id**: Delete a user account.

- **POST /api/cars/**: Add a new car.
- **POST /api/cars/**: GET all cars.
- **GET /api/cars/:id**: GET car by id.
- **DELETE /api/cars/:id**: DELETE a car
- **PUT /api/cars/:id**: UPDATE a car e.g upload a car pictures

### Error Handling

The project uses custom error handling middleware to handle and format errors.

- **BADREQUEST EXCEPTION**[400]: Bad request or malformed request body
- **NOTFOUND EXCEPTION**[404]: Handles Not found exception
- **CONFLICT EXCEPTION**[409]: Handles conflict exception
- **INTERNAL ERROR**[500]: Handles internal server error exception

### Security

- **Helmet** is used to set various HTTP headers for security.
- **JWT** is used for authentication and securing endpoints.
- **CORS** is used for cross-origin authentication.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd carpooling-service
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the necessary environment variables (see below).

4. Start the development server:
   ```sh
   npm run dev
   ```

## Scripts

- **test**: Runs the Jest test suite.
- **dev**: Runs the server in development mode using `ts-node-dev`.
- **start**: Builds the project and starts the server.
- **build**: Compiles TypeScript to JavaScript.
- **prettier**: Checks the code formatting.
- **husky-install**: Installs Husky for Git hooks.
- **prepare**: Prepares the Husky configuration.

## Environment Variables

The project requires certain environment variables to be set. Create a `.env` file in the root of your project and add the following:

```plaintext
PORT=<your-port>
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_URL=<your-cloudinary-url>
NGROK_AUTHTOKEN=<your-ngrok-authtoken>
```

## License

This project is licensed under the ISC License.
