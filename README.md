
# NYA Services Dashboard

A self-hosted dashboard for managing and monitoring your self-hosted services.

## Features

- Service status monitoring
- User management
- Support ticket system
- Integration with Uptime Kuma
- Local authentication

## Installation

### Option 1: Manual Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/nya-services.git
   cd nya-services
   ```

2. Run the installation script:
   ```bash
   node install.js
   ```

3. Build the frontend:
   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   node server.js
   ```

5. Access the dashboard at http://localhost:3001

### Option 2: Docker Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/nya-services.git
   cd nya-services
   ```

2. Start with Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the dashboard at http://localhost:3001

## Configuration

The dashboard stores all data in the `data` directory:

- `services.json`: Service configurations
- `users.json`: User accounts
- `tickets.json`: Support tickets
- `integrations.json`: Integration configurations

## Environment Variables

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:3001/api
PORT=3001
```

## Default Login

Username: admin  
Password: nyaservices2025

## License

MIT
