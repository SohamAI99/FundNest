# FundNest Backend Server

This is the backend server for the FundNest platform, built with Express.js and Prisma.

## Features

- RESTful API for user authentication and management
- Role-based access control (Startup/Investor)
- Real-time platform statistics
- Database integration with PostgreSQL (Neon)
- CORS configuration for cross-origin requests
- JWT-based authentication
- Rate limiting for security
- Serverless deployment ready for Vercel

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/verify` - Token verification

### Statistics
- `GET /api/stats/platform-stats` - Get platform statistics
- `GET /api/stats/dashboard-stats/:userId` - Get user dashboard stats
- `GET /api/stats/activity-feed/:userId` - Get user activity feed

## Environment Variables

Required environment variables:

```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
NODE_ENV=production
JWT_SECRET=your-jwt-secret-key
CORS_ORIGINS=https://your-frontend-domain.com
PORT=5001
```

## Development

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up database:
```bash
npx prisma generate
npx prisma db push
```

4. Start development server:
```bash
npm run dev
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy to Vercel:
```bash
vercel --prod
```

The server is configured for serverless deployment with Vercel. The `vercel.json` file contains the necessary configuration for routing and environment variables.

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

## Database Schema

The application uses Prisma with the following main models:
- `User` - User accounts and authentication
- `Startup` - Startup profiles and information
- `Investor` - Investor profiles and preferences

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on authentication endpoints
- CORS protection
- Input validation
- SQL injection prevention with Prisma

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
