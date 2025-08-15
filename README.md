# DB-Agnostic Auth Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![NestJS Version](https://img.shields.io/badge/NestJS-v10-orange?logo=nestjs)](https://nestjs.com/)

A **flexible authentication backend** built with **NestJS** that supports multiple database types including **PostgreSQL, MySQL, MongoDB**, and more. This project provides a secure, scalable, and database-agnostic authentication system with Docker support for seamless development and production environments.

---

## Features

- **User Registration and Login**: Secure endpoints for user sign-up (with OTP verification) and authentication.
- **JWT-based Authentication**: Token-based authentication with JSON Web Tokens.
- **Access and Refresh Tokens**: Supports access tokens for secure API access and refresh tokens for maintaining user sessions.
- **Password Reset**: Allows users to request and reset passwords securely via email.
- **User Logout**: Invalidate tokens to securely log out users.
- **Database-Agnostic**: Compatible with PostgreSQL, MySQL, MongoDB, and other TypeORM-supported databases.
- **Docker Support**: Pre-configured Docker setup for development, testing, and production.
- **Easy Setup and Management**: Streamlined scripts for running, testing, and managing the project.

---

## Prerequisites

- **Node.js**: Version >= 18.0.0
- **PNPM**: Package manager for installing dependencies
- **Docker** (optional): For containerized development and deployment
- **Database**: PostgreSQL, MySQL, MongoDB, or any TypeORM-supported database

---

## Project Setup

Follow these steps to set up the project locally or with Docker:

```bash
# Clone the repository
git clone https://github.com/Sanjay-k-m/nestjs-auth-starter.git
cd nestjs-auth-starter

# Install dependencies
pnpm install
```

### Environment Variables

```bash
# Copy the example .env file to create your local .env
cp .env.example .env

# Edit .env to configure your database and other settings
# All necessary variables are included in .env.example with sensible defaults
```

### Running with Docker

```bash
# Build and start the application with Docker
docker-compose up --build

# Stop the containers
docker-compose down
```

### Running Locally

```bash
# Start the development server
pnpm start:dev

```

> **Note**: All commands for running the project—whether locally, with Docker, for migrations, seeding, or tests—are detailed in the `scripts.md` file at the root of the project. Refer to it for additional instructions.

---

## API Documentation

### Swagger UI

Interactive API documentation is available via Swagger UI. After starting the application, access it at:

```
http://localhost:3000/api-docs
```

Use Swagger UI to explore and test all available endpoints.

### Postman Collection

A Postman collection is provided for testing the API endpoints. The collection is available in JSON format at the root of the project as **`Nest_Auth_API.postman_collection.json`** Import it into Postman to test the APIs, including registration, login, logout, password reset, and token refresh.

---

## Resources

- **NestJS Documentation**: [https://docs.nestjs.com](https://docs.nestjs.com)
- **Video Courses**: [https://courses.nestjs.com/](https://courses.nestjs.com/)
- **NestJS Devtools**: [https://devtools.nestjs.com](https://devtools.nestjs.com)
- **Community Support**: Join the NestJS Discord community at [https://discord.gg/G7Qnnhy](https://discord.gg/G7Qnnhy)

---

## Contributing

Contributions are welcome! Follow these steps to contribute:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/your-feature

# 3. Commit your changes
git commit -m "feat: add feature description"

# 4. Push to the branch
git push origin feature/your-feature

# 5. Open a Pull Request
```

Please ensure your code follows the project's coding standards and includes tests where applicable.

---

## License

This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for details.

---

## Contact

**Author**: Sanjay Km  
**GitHub**: [https://github.com/sanjay-k-m](https://github.com/sanjay-k-m)  
**LinkedIn**: [https://linkedin.com/in/sanjay-k-m](https://linkedin.com/in/sanjay-k-m)

For questions, suggestions, or feedback, feel free to open an issue or reach out via GitHub.
