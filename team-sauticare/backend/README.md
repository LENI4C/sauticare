# SautiCare Backend API

The backend API for SautiCare mental health chatbot, built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+
-   MongoDB
-   npm or yarn

### Installation

1. **Install dependencies**

    ```bash
    npm install
    ```

2. **Environment setup**

    ```bash
    cp env.example .env
    # Edit .env with your configuration
    ```

3. **Start the server**

    ```bash
    # Development
    npm run dev

    # Production
    npm start
    ```

## 📁 Project Structure

```
src/
├── controllers/         # Route controllers
│   ├── chatController.js
│   ├── crisisController.js
│   ├── userController.js
│   └── resourceController.js
├── models/             # Database models
│   ├── User.js
│   ├── Conversation.js
│   └── Resource.js
├── routes/             # API routes
│   ├── chatRoutes.js
│   ├── crisisRoutes.js
│   ├── userRoutes.js
│   └── resourceRoutes.js
├── middleware/         # Custom middleware
│   ├── errorHandler.js
│   └── validateRequest.js
├── services/           # Business logic
├── utils/              # Utility functions
│   ├── logger.js
│   └── seedData.js
├── config/             # Configuration
│   └── database.js
└── server.js           # Main server file
```

## 🔧 Configuration

### Environment Variables

| Variable                 | Description               | Default                             |
| ------------------------ | ------------------------- | ----------------------------------- |
| `PORT`                   | Server port               | 5000                                |
| `NODE_ENV`               | Environment               | development                         |
| `MONGODB_URI`            | MongoDB connection string | mongodb://localhost:27017/sauticare |
| `JWT_SECRET`             | JWT signing secret        | -                                   |
| `JWT_EXPIRES_IN`         | JWT expiration time       | 7d                                  |
| `OPENAI_API_KEY`         | OpenAI API key            | -                                   |
| `HUGGINGFACE_API_KEY`    | HuggingFace API key       | -                                   |
| `CRISIS_HOTLINE_NIGERIA` | Crisis hotline number     | +234-806-210-0053                   |
| `FRONTEND_URL`           | Frontend URL for CORS     | http://localhost:3000               |

## 📚 API Endpoints

### Health Check

```http
GET /health
```

### Chat Endpoints

-   `POST /api/chat/start` - Start new conversation
-   `POST /api/chat/send` - Send message
-   `GET /api/chat/:sessionId` - Get conversation
-   `POST /api/chat/end/:sessionId` - End conversation
-   `GET /api/chat/:sessionId/analytics` - Get conversation analytics

### Crisis Endpoints

-   `GET /api/crisis/resources` - Get crisis resources
-   `POST /api/crisis/report` - Report crisis incident
-   `GET /api/crisis/stats` - Get crisis statistics
-   `GET /api/crisis/recommendations` - Get crisis recommendations

### User Endpoints

-   `POST /api/users/register` - Register user
-   `POST /api/users/login` - Login user
-   `GET /api/users/profile/:userId` - Get user profile
-   `PUT /api/users/profile/:userId` - Update user profile
-   `DELETE /api/users/:userId` - Delete user

### Resource Endpoints

-   `GET /api/resources` - Get resources
-   `GET /api/resources/crisis` - Get crisis resources
-   `GET /api/resources/:resourceId` - Get specific resource
-   `POST /api/resources/:resourceId/rate` - Rate resource
-   `POST /api/resources/:resourceId/use` - Record usage

## 🗄️ Database Models

### User Model

-   User authentication and profile information
-   Mental health history tracking
-   Crisis history and intervention records
-   Language preferences

### Conversation Model

-   Chat session management
-   Message storage with metadata
-   Crisis detection tracking
-   Conversation analytics

### Resource Model

-   Mental health resources
-   Multilingual content
-   Crisis-specific resources
-   Usage tracking and ratings

## 🛡️ Security Features

-   JWT authentication
-   Password hashing with bcrypt
-   Rate limiting
-   Input validation
-   CORS protection
-   Helmet.js security headers
-   MongoDB injection prevention

## 📊 Logging

-   Winston logger with multiple transports
-   Error tracking
-   Request logging
-   Crisis incident logging
-   Performance monitoring

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t sauticare-backend .

# Run container
docker run -p 5000:5000 sauticare-backend
```

### Environment Variables for Production

-   Set `NODE_ENV=production`
-   Configure production MongoDB URI
-   Set secure JWT secret
-   Configure CORS for production domain
-   Set up proper logging

## 🔧 Development

### Adding New Endpoints

1. Create controller in `src/controllers/`
2. Add routes in `src/routes/`
3. Add validation rules
4. Update API documentation

### Database Migrations

-   Use Mongoose schema changes
-   Update seed data in `src/utils/seedData.js`
-   Test migrations in development

### Error Handling

-   Use centralized error handler
-   Log errors with Winston
-   Return appropriate HTTP status codes
-   Provide helpful error messages

## 📈 Monitoring

### Health Checks

-   Database connectivity
-   External API availability
-   Memory usage
-   Response times

### Metrics

-   Request count and response times
-   Error rates
-   Crisis detection frequency
-   User engagement metrics

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure security best practices
5. Test thoroughly before submitting PR

## 📄 License

MIT License - see LICENSE file for details.
