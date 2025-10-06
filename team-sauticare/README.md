# SautiCare - A Caring Voice for Mental Health

SautiCare is an AI-powered multilingual mental health chatbot that provides support in English, Nigerian Pidgin, and Hausa. It offers empathetic conversations, crisis detection, and culturally relevant mental health resources for underserved communities.

## 🌟 Features

-   **Multilingual Support**: English, Nigerian Pidgin, and Hausa
-   **AI-Powered Conversations**: Empathetic, context-aware responses
-   **Crisis Detection**: Automatic detection of mental health crises with immediate intervention
-   **Culturally Relevant**: Designed specifically for Nigerian communities
-   **Resource Library**: Access to mental health resources and crisis hotlines
-   **Mobile-First Design**: Optimized for mobile devices
-   **Anonymous Support**: Option for anonymous conversations

## 🏗️ Architecture

### Backend (Node.js/Express)

-   RESTful API with comprehensive endpoints
-   MongoDB for data persistence
-   JWT authentication
-   Rate limiting and security middleware
-   Comprehensive logging and error handling

### AI Services

-   Language detection for multilingual support
-   Crisis detection with severity levels
-   Context-aware response generation
-   Integration with OpenAI and HuggingFace APIs

### Frontend (Next.js/React)

-   Modern React with TypeScript
-   Tailwind CSS for styling
-   Real-time chat interface
-   Crisis alert system
-   Responsive design

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+
-   MongoDB
-   npm or yarn

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd sauticare
    ```

2. **Install dependencies**

    ```bash
    # Backend
    cd team-sauticare/backend
    npm install

    # AI Services
    cd ../ai
    npm install

    # Frontend
    cd ../frontend
    npm install
    ```

3. **Environment Setup**

    Create `.env` files in the backend directory:

    ```bash
    # Backend .env
    PORT=5000
    NODE_ENV=development
    MONGODB_URI=mongodb://localhost:27017/sauticare
    JWT_SECRET=your-super-secret-jwt-key-here
    JWT_EXPIRES_IN=7d
    OPENAI_API_KEY=your-openai-api-key
    HUGGINGFACE_API_KEY=your-huggingface-api-key
    CRISIS_HOTLINE_NIGERIA=+234-806-210-0053
    CRISIS_HOTLINE_EMAIL=crisis@sauticare.ng
    FRONTEND_URL=http://localhost:3000
    ```

    Create `.env.local` in the frontend directory:

    ```bash
    # Frontend .env.local
    BACKEND_URL=http://localhost:5000
    ```

4. **Start the services**

    **Terminal 1 - Backend:**

    ```bash
    cd team-sauticare/backend
    npm run dev
    ```

    **Terminal 2 - AI Services:**

    ```bash
    cd team-sauticare/ai
    npm run dev
    ```

    **Terminal 3 - Frontend:**

    ```bash
    cd team-sauticare/frontend
    npm run dev
    ```

5. **Access the application**
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:5000
    - Health Check: http://localhost:5000/health

## 📚 API Documentation

### Chat Endpoints

#### Start Conversation

```http
POST /api/chat/start
Content-Type: application/json

{
  "preferredLanguage": "en",
  "userId": "optional-user-id"
}
```

#### Send Message

```http
POST /api/chat/send
Content-Type: application/json

{
  "message": "I'm feeling anxious today",
  "sessionId": "session_123",
  "userId": "optional-user-id"
}
```

#### Get Conversation

```http
GET /api/chat/{sessionId}?limit=50&offset=0
```

### Crisis Endpoints

#### Get Crisis Resources

```http
GET /api/crisis/resources?language=en
```

#### Report Crisis

```http
POST /api/crisis/report
Content-Type: application/json

{
  "sessionId": "session_123",
  "crisisLevel": "high",
  "description": "User expressing suicidal thoughts",
  "location": "Lagos, Nigeria"
}
```

### User Endpoints

#### Register User

```http
POST /api/users/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "preferredLanguage": "en"
}
```

#### Login User

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## 🧠 AI Features

### Language Detection

-   Automatic detection of English, Pidgin, and Hausa
-   Pattern-based recognition for Nigerian languages
-   Confidence scoring for detection accuracy

### Crisis Detection

-   Multi-level crisis severity assessment
-   Keyword-based analysis with cultural context
-   Immediate intervention recommendations
-   Integration with emergency services

### Response Generation

-   Context-aware conversation flow
-   Empathetic and culturally appropriate responses
-   Integration with OpenAI GPT models
-   Fallback to rule-based responses

## 🛡️ Security Features

-   JWT-based authentication
-   Rate limiting to prevent abuse
-   Input validation and sanitization
-   CORS protection
-   Helmet.js security headers
-   MongoDB injection prevention

## 📊 Monitoring and Logging

-   Comprehensive logging with Winston
-   Error tracking and reporting
-   Performance monitoring
-   Crisis incident logging
-   User activity tracking

## 🌍 Multilingual Support

### English

-   Standard English responses
-   Mental health terminology
-   Professional support language

### Nigerian Pidgin

-   Culturally appropriate expressions
-   Local mental health concepts
-   Community-friendly language

### Hausa

-   Traditional language support
-   Cultural sensitivity
-   Regional mental health awareness

## 🚨 Crisis Intervention

### Detection Levels

-   **Low**: General emotional distress
-   **Medium**: Moderate mental health concerns
-   **High**: Significant crisis indicators
-   **Critical**: Immediate danger requiring emergency response

### Intervention Process

1. Automatic crisis detection
2. Severity assessment
3. Immediate alert system
4. Resource provision
5. Professional referral
6. Follow-up tracking

## 🔧 Development

### Project Structure

```
team-sauticare/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── package.json
├── ai/                     # AI services
│   ├── src/
│   │   ├── services/       # AI service implementations
│   │   ├── models/         # AI model configurations
│   │   └── utils/          # AI utilities
│   └── package.json
├── frontend/               # Next.js React app
│   ├── components/         # React components
│   ├── pages/             # Next.js pages
│   └── package.json
└── README.md
```

### Running Tests

```bash
# Backend tests
cd team-sauticare/backend
npm test

# AI services tests
cd team-sauticare/ai
npm test
```

### Database Seeding

```bash
cd team-sauticare/backend
node -e "require('./src/utils/seedData').seedResources()"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

-   Email: support@sauticare.ng
-   Crisis Hotline: +234-806-210-0053
-   Emergency Services: 199 or 112

## 🙏 Acknowledgments

-   Mental health professionals who provided guidance
-   Nigerian language experts for cultural accuracy
-   Open source community for tools and libraries
-   Crisis intervention specialists for safety protocols

---

**Important**: This is a mental health support tool. If you or someone you know is in immediate danger, please contact emergency services (199 or 112 in Nigeria) or the crisis hotline (+234-806-210-0053) immediately.
