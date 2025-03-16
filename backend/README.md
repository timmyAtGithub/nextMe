# Project Setup Guide

This guide explains how to set up and run the project locally. The project consists of a Node.js backend connected to a PostgreSQL database, and uses Docker for containerization as well as Ngrok for making the local server publicly accessible.

## Prerequisites

Before starting, ensure that the following tools are installed on your system:

- **Node.js** (version 16 or higher)
- **npm** (usually installed with Node.js)
- **Docker** (for containerization)
- **Docker Compose** (usually installed with Docker)
- **Ngrok** (for making the local server publicly accessible)

## 1. Set Up Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
DB_USER=user
DB_HOST=db
DB_NAME=app_db
DB_PASSWORD=password
DB_PORT=5432
TOKEN=your_ngrok_auth_token
```

Replace `your_ngrok_auth_token` with your personal Ngrok authentication token. For more information, refer to the [Ngrok documentation](https://ngrok.com/docs).

## 2. Install Dependencies

Install the required npm packages:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a apiConfig.js and add your URL like
```js
const apiConfig = {
    BASE_URL: 'YOUR_URL',
  };

  module.exports = apiConfig;
```

## 4. Use Docker Compose

The project includes a `docker-compose.yml` file that runs the backend and the PostgreSQL database in Docker containers. Run the following command to start the containers:

```bash
docker-compose up --build
```

This command builds the Docker images and starts the containers. The backend will be available on port 5000, and the PostgreSQL database on port 5432.

## 5. Set Up Ngrok for Public Access

To make the local server publicly accessible, use Ngrok. Run the following command:

```bash
./start.sh
```

This script starts the server and uses Ngrok to create a public tunnel.

## 6. Access the Server

Once the server and Ngrok are running, you can access the server via the following URLs:

- Locally: [http://localhost:5000](http://localhost:5000)
- Publicly: The Ngrok-provided URL (displayed in the console)

## 7. Additional Information

- **Database Queries**: Test the database connection by calling the root route (`/`), which executes a simple query and returns the current date.
- **Static Files**: Uploaded files are stored in the `uploads` directory and can be accessed via the `/uploads` route.

## 8. Stop the Server

To stop the server and Ngrok, press `Ctrl + C` in the corresponding terminal windows. To stop the Docker containers, run the following command:

```bash
docker-compose down
```
