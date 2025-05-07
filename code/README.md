# Platform Connect Application

Full-stack application with React.js frontend and Express.js/MongoDB Atlas backend.

## Project Structure

- `/src` - Frontend React application
- `/backend` - Express.js and MongoDB Atlas backend

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- MongoDB Atlas account

## Backend Setup

1. Create a MongoDB Atlas account and set up a cluster
2. Create a `.env` file in the `/backend` directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://<your-username>:<your-password>@<your-cluster-url>/platform-connect?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

3. Install backend dependencies:

```bash
cd backend
npm install
```

4. Start the backend development server:

```bash
npm run dev
```

## Frontend Setup

1. Install frontend dependencies:

```bash
npm install
```

2. Start the frontend development server:

```bash
npm run dev
```

## Running the Application

1. Start the backend server first:

```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend:

```bash
npm run dev
```

3. Access the application in your browser at `http://localhost:5173`

## Features

- User authentication with JWT
- Two user roles: Job Seeker and Industry
- Different profile views and permissions based on user role
- Modern UI with shadcn/ui components

## License

MIT

## Project info

**URL**: https://lovable.dev/projects/cbc3a9b3-982c-44a9-8225-5aaee2c5a429

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cbc3a9b3-982c-44a9-8225-5aaee2c5a429) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cbc3a9b3-982c-44a9-8225-5aaee2c5a429) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
