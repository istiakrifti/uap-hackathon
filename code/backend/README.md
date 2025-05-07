# Platform Connect Backend

Express.js and MongoDB Atlas backend for the Platform Connect application.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt.js for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm
- MongoDB Atlas account

### Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://<your-username>:<your-password>@<your-cluster-url>/platform-connect?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Replace the MongoDB URI with your actual MongoDB Atlas connection string.

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run in production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (requires authentication)

### User Operations

- `GET /api/users/:id` - Get user by ID (requires authentication)
- `PUT /api/users/profile` - Update user profile (requires authentication)
- `GET /api/users/industry/all` - Get all industry profiles (requires job_seeker role)
- `GET /api/users/job-seekers/all` - Get all job seekers (requires industry role)

## Authentication

The API uses JWT for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your-token-here
```