# SautiCare AI Services

AI-powered services for SautiCare mental health chatbot, providing multilingual support, crisis detection, and intelligent conversation management.

## 🌟 Features

-   **Language Detection**: Automatic detection of English, Nigerian Pidgin, and Hausa
-   **Crisis Detection**: Multi-level crisis severity assessment with cultural context
-   **Response Generation**: Context-aware, empathetic responses
-   **Sentiment Analysis**: Emotional state detection and tracking
-   **Multilingual Support**: Culturally appropriate responses in local languages

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+
-   OpenAI API key (optional)
-   HuggingFace API key (optional)

### Installation

1. **Install dependencies**

    ```bash
    npm install
    ```

2. **Environment setup**

    ```bash
    cp .env.example .env
    # Edit .env with your API keys
    ```

3. **Start the service**

    ```bash
    # Development
    npm run dev

    # Production
    npm start
    ```

## 📁 Project Structure

```
src/
├── services/           # AI service implementations
│   ├── languageDetection.js
│   ├── crisisDetection.js
│   └── chatbotService.js
├── models/            # AI model configurations
├── utils/             # Utility functions
│   └── logger.js
└── training/          # Model training scripts
```

## 🔧 Configuration

### Environment Variables

| Variable              | Description                   | Default     |
| --------------------- | ----------------------------- | ----------- |
| `OPENAI_API_KEY`      | OpenAI API key for GPT models | -           |
| `HUGGINGFACE_API_KEY` | HuggingFace API key           | -           |
| `LOG_LEVEL`           | Logging level                 | info        |
| `NODE_ENV`            | Environment                   | development |

## 🧠 AI Services

### Language Detection Service

Automatically detects the language of user input with high accuracy.

```javascript
const languageDetection = require("./src/services/languageDetection");

// Detect language
const result = languageDetection.detectLanguage("How you dey?");
console.log(result); // "pidgin"

// Get confidence score
const detailed = languageDetection.getLanguageWithConfidence("I'm feeling sad");
console.log(detailed); // { language: "en", confidence: 0.95 }
```

**Supported Languages:**

-   English (en)
-   Nigerian Pidgin (pidgin)
-   Hausa (hausa)

**Features:**

-   Pattern-based detection for Nigerian languages
-   Confidence scoring
-   Mixed language detection
-   Cultural context awareness

### Crisis Detection Service

Advanced crisis detection with severity levels and cultural sensitivity.

```javascript
const crisisDetection = require("./src/services/crisisDetection");

// Analyze for crisis indicators
const analysis = crisisDetection.analyzeCrisis("I want to end it all", "en");

console.log(analysis);
// {
//   isCrisis: true,
//   level: "critical",
//   score: 0.9,
//   keywords: ["end it all"],
//   confidence: 0.85,
//   recommendations: [...]
// }
```

**Crisis Levels:**

-   **Low**: General emotional distress
-   **Medium**: Moderate mental health concerns
-   **High**: Significant crisis indicators
-   **Critical**: Immediate danger requiring emergency response

**Features:**

-   Multi-level severity assessment
-   Cultural keyword recognition
-   Immediate danger detection
-   Intervention recommendations
-   Language-specific crisis terms

### Chatbot Service

Intelligent conversation management with context awareness.

```javascript
const chatbotService = require("./src/services/chatbotService");

// Generate response
const response = await chatbotService.generateResponse(
    "I'm feeling anxious",
    "Previous conversation context...",
    "user123"
);

console.log(response);
// {
//   message: "I understand you're feeling anxious...",
//   language: "en",
//   sentiment: "negative",
//   crisisDetected: false,
//   confidence: 0.9
// }
```

**Features:**

-   Context-aware responses
-   Multilingual conversation support
-   Crisis-aware responses
-   Empathetic tone adaptation
-   Fallback mechanisms

## 🌍 Multilingual Support

### English

-   Professional mental health terminology
-   Standard therapeutic language
-   Crisis intervention protocols

### Nigerian Pidgin

-   Culturally appropriate expressions
-   Local mental health concepts
-   Community-friendly language
-   Common phrases and idioms

### Hausa

-   Traditional language support
-   Cultural sensitivity
-   Regional mental health awareness
-   Respectful communication style

## 🚨 Crisis Detection

### Detection Methods

1. **Keyword Analysis**: Crisis-related terms and phrases
2. **Pattern Recognition**: Linguistic patterns indicating distress
3. **Cultural Context**: Language-specific crisis indicators
4. **Severity Scoring**: Quantitative assessment of risk level

### Intervention Levels

-   **Immediate Action**: Critical crisis requiring emergency response
-   **Professional Help**: High-level crisis needing professional intervention
-   **Coping Strategies**: Medium-level concerns with resource provision
-   **General Support**: Low-level emotional support

### Cultural Considerations

-   Nigerian cultural context
-   Language-specific crisis terms
-   Community support systems
-   Religious and traditional beliefs

## 🔧 API Integration

### OpenAI Integration

```javascript
// GPT-3.5-turbo for response generation
const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
    ],
    max_tokens: 500,
    temperature: 0.7,
});
```

### HuggingFace Integration

```javascript
// For specialized NLP tasks
const response = await hf.textClassification({
    model: "cardiffnlp/twitter-roberta-base-sentiment-latest",
    inputs: userMessage,
});
```

## 📊 Performance Optimization

### Caching

-   Response caching for common queries
-   Language detection caching
-   Crisis pattern caching

### Rate Limiting

-   API call rate limiting
-   Request throttling
-   Resource management

### Monitoring

-   Response time tracking
-   Accuracy metrics
-   Error rate monitoring
-   Usage analytics

## 🧪 Testing

```bash
# Run tests
npm test

# Run specific test file
npm test -- --grep "Language Detection"

# Run with coverage
npm run test:coverage
```

### Test Categories

-   Language detection accuracy
-   Crisis detection sensitivity
-   Response quality assessment
-   Cultural appropriateness
-   Performance benchmarks

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t sauticare-ai .

# Run container
docker run -p 3001:3001 sauticare-ai
```

### Environment Setup

-   Configure API keys
-   Set up logging
-   Configure monitoring
-   Set production parameters

## 🔧 Development

### Adding New Languages

1. Update language detection patterns
2. Add crisis keywords
3. Create response templates
4. Update cultural context
5. Test thoroughly

### Improving Crisis Detection

1. Analyze false positives/negatives
2. Update keyword lists
3. Refine severity scoring
4. Add cultural context
5. Validate with mental health professionals

### Response Quality

1. Monitor user feedback
2. Analyze conversation flows
3. Update response templates
4. Improve context awareness
5. Enhance empathy levels

## 📈 Monitoring and Analytics

### Key Metrics

-   Language detection accuracy
-   Crisis detection sensitivity
-   Response quality scores
-   User satisfaction ratings
-   Cultural appropriateness

### Logging

-   Request/response logging
-   Error tracking
-   Performance metrics
-   Crisis incident logging
-   User interaction patterns

## 🤝 Contributing

1. Follow AI/ML best practices
2. Ensure cultural sensitivity
3. Test with diverse inputs
4. Validate with mental health experts
5. Document changes thoroughly

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

-   Mental health professionals for guidance
-   Nigerian language experts for cultural accuracy
-   Crisis intervention specialists for safety protocols
-   Open source AI community for tools and models
