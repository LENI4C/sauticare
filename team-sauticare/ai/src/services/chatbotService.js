const axios = require("axios");
const logger = require("../utils/logger");
const languageDetection = require("./languageDetection");
const crisisDetection = require("./crisisDetection");

class ChatbotService {
    constructor() {
        this.openaiApiKey = process.env.OPENAI_API_KEY;
        this.huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;

        // Response templates for different languages and contexts
        this.responseTemplates = {
            en: {
                greeting:
                    "Hello! I'm here to listen and support you. How are you feeling today?",
                empathy: [
                    "I understand you're going through a difficult time. I'm here to listen.",
                    "Thank you for sharing that with me. It takes courage to open up.",
                    "I can hear that you're struggling. You're not alone in this.",
                    "Your feelings are valid, and it's important to acknowledge them.",
                ],
                support: [
                    "What would be most helpful for you right now?",
                    "Is there anything specific that's been weighing on your mind?",
                    "Would you like to talk about what's been challenging for you?",
                    "How can I best support you today?",
                ],
                crisis: "I'm very concerned about what you've shared. Your safety is important to me. Please consider reaching out to a crisis hotline or emergency services.",
            },
            pidgin: {
                greeting:
                    "Hello! I dey here to listen and support you. How you dey feel today?",
                empathy: [
                    "I understand say you dey pass through hard time. I dey here to listen.",
                    "Thank you for sharing that with me. E take courage to open up.",
                    "I hear say you dey struggle. You no dey alone for this matter.",
                    "Your feelings na valid, and e important to acknowledge them.",
                ],
                support: [
                    "Wetin go help you well well right now?",
                    "Get anything specific wey dey worry you?",
                    "You wan talk about wetin dey challenge you?",
                    "How I fit support you well well today?",
                ],
                crisis: "I dey worry well well about wetin you share. Your safety na important to me. Abeg consider to call crisis hotline or emergency services.",
            },
            hausa: {
                greeting:
                    "Sannu! Ina nan don sauraron ku da tallafawa. Yaya kuke ji a yau?",
                empathy: [
                    "Na fahimci cewa kuna fuskantar wahala. Ina nan don sauraron ku.",
                    "Na gode da raba wannan da ni. Yana buƙatar ƙarfin hali don buɗewa.",
                    "Na ji cewa kuna fama. Ba ku kaɗai a cikin wannan al'amari ba.",
                    "Tunanin ku na da inganci, kuma yana da muhimmanci a yarda da su.",
                ],
                support: [
                    "Mene ne zai taimaka muku sosai a yanzu?",
                    "Akwai wani abu na musamman da ke damun ku?",
                    "Kuna so ku yi magana game da abin da ke ƙalubalantar ku?",
                    "Yaya zan iya tallafawa ku sosai a yau?",
                ],
                crisis: "Ina damu sosai game da abin da kuka raba. Amincin ku yana da muhimmanci a gare ni. Don Allah ku yi la'akari da kiran lambar gaggawa ko sabis na gaggawa.",
            },
        };
    }

    /**
     * Generate a response to user input
     * @param {string} userMessage - User's message
     * @param {string} conversationHistory - Previous conversation context
     * @param {string} userId - User ID
     * @param {string} mood - User's current mood
     * @returns {Object} - Response object with message and metadata
     */
    async generateResponse(
        userMessage,
        conversationHistory = "",
        userId = null,
        mood = null
    ) {
        try {
            // Detect language
            const languageResult =
                languageDetection.getLanguageWithConfidence(userMessage);
            const language = languageResult.language;

            logger.info(
                `Processing message in ${language} (confidence: ${languageResult.confidence})`
            );

            // Analyze for crisis indicators
            const crisisAnalysis = crisisDetection.analyzeCrisis(
                userMessage,
                language
            );

            // If crisis detected, prioritize crisis response
            if (crisisAnalysis.isCrisis) {
                return await this.handleCrisisResponse(
                    crisisAnalysis,
                    language,
                    userMessage
                );
            }

            // Generate appropriate response based on language, context, and mood
            const response = await this.generateContextualResponse(
                userMessage,
                conversationHistory,
                language,
                userId,
                mood
            );

            return {
                message: response,
                language,
                sentiment: "neutral", // This would be enhanced with sentiment analysis
                crisisDetected: false,
                confidence: languageResult.confidence,
                metadata: {
                    responseTime: Date.now(),
                    model: "sauticare-chatbot",
                    version: "1.0.0",
                },
            };
        } catch (error) {
            logger.error("Error generating response:", error);
            return this.getFallbackResponse(
                languageDetection.detectLanguage(userMessage)
            );
        }
    }

    /**
     * Handle crisis response
     * @param {Object} crisisAnalysis - Crisis analysis results
     * @param {string} language - Detected language
     * @param {string} userMessage - Original user message
     * @returns {Object} - Crisis response object
     */
    async handleCrisisResponse(crisisAnalysis, language, userMessage) {
        const templates =
            this.responseTemplates[language] || this.responseTemplates.en;

        let response = templates.crisis;

        // Add specific recommendations based on crisis level
        if (crisisAnalysis.recommendations) {
            crisisAnalysis.recommendations.forEach((rec) => {
                if (rec.type === "immediate_action") {
                    response += `\n\n${rec.message}`;
                }
            });
        }

        return {
            message: response,
            language,
            sentiment: "crisis",
            crisisDetected: true,
            crisisLevel: crisisAnalysis.level,
            crisisScore: crisisAnalysis.score,
            confidence: crisisAnalysis.confidence,
            recommendations: crisisAnalysis.recommendations,
            metadata: {
                responseTime: Date.now(),
                model: "sauticare-crisis-detection",
                version: "1.0.0",
                immediateAction: crisisAnalysis.immediateDanger,
            },
        };
    }

    /**
     * Generate contextual response
     * @param {string} userMessage - User's message
     * @param {string} conversationHistory - Previous conversation
     * @param {string} language - Detected language
     * @param {string} userId - User ID
     * @param {string} mood - User's current mood
     * @returns {string} - Generated response
     */
    async generateContextualResponse(
        userMessage,
        conversationHistory,
        language,
        userId,
        mood = null
    ) {
        try {
            // Use OpenAI API if available
            if (this.openaiApiKey) {
                return await this.generateOpenAIResponse(
                    userMessage,
                    conversationHistory,
                    language,
                    mood
                );
            }

            // Fallback to rule-based responses
            return this.generateRuleBasedResponse(userMessage, language, mood);
        } catch (error) {
            logger.error("Error in contextual response generation:", error);
            return this.generateRuleBasedResponse(userMessage, language);
        }
    }

    /**
     * Generate response using OpenAI API
     * @param {string} userMessage - User's message
     * @param {string} conversationHistory - Previous conversation
     * @param {string} language - Detected language
     * @param {string} mood - User's current mood
     * @returns {string} - Generated response
     */
    async generateOpenAIResponse(
        userMessage,
        conversationHistory,
        language,
        mood = null
    ) {
        const systemPrompt = this.getSystemPrompt(language, mood);

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
        ];

        if (conversationHistory) {
            messages.splice(1, 0, {
                role: "assistant",
                content: conversationHistory,
            });
        }

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: messages,
                max_tokens: 500,
                temperature: 0.7,
                top_p: 0.9,
            },
            {
                headers: {
                    Authorization: `Bearer ${this.openaiApiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0].message.content.trim();
    }

    /**
     * Generate rule-based response
     * @param {string} userMessage - User's message
     * @param {string} language - Detected language
     * @returns {string} - Generated response
     */
    generateRuleBasedResponse(userMessage, language, mood = null) {
        const templates =
            this.responseTemplates[language] || this.responseTemplates.en;
        const lowerMessage = userMessage.toLowerCase();

        // Check for specific patterns and respond accordingly
        if (this.isGreeting(lowerMessage, language)) {
            return templates.greeting;
        }

        if (this.isNegativeEmotion(lowerMessage, language)) {
            const empathyResponse =
                templates.empathy[
                    Math.floor(Math.random() * templates.empathy.length)
                ];
            const supportResponse =
                templates.support[
                    Math.floor(Math.random() * templates.support.length)
                ];
            return `${empathyResponse} ${supportResponse}`;
        }

        if (this.isPositiveEmotion(lowerMessage, language)) {
            return this.getPositiveResponse(language);
        }

        // Default response
        return templates.support[
            Math.floor(Math.random() * templates.support.length)
        ];
    }

    /**
     * Get system prompt for OpenAI
     * @param {string} language - Language code
     * @returns {string} - System prompt
     */
    getSystemPrompt(language, mood = null) {
        const moodContext = mood ? this.getMoodContext(mood, language) : "";

        const prompts = {
            en: `You are SautiCare, a compassionate mental health support chatbot. You provide empathetic, non-judgmental support to users who may be struggling with mental health issues. Always respond with care, understanding, and appropriate resources when needed. Keep responses concise but meaningful.${moodContext}`,
            pidgin: `You be SautiCare, one caring mental health support chatbot. You dey provide support with empathy and no judgment to people wey dey struggle with mental health issues. Always respond with care, understanding, and appropriate resources when needed. Keep responses short but meaningful.${moodContext}`,
            hausa: `Kai ne SautiCare, na'ura mai tallafawa lafiyar hankali mai tausayi. Kana ba da tallafi tare da tausayi da rashin hukunci ga mutanen da ke fuskantar matsalolin lafiyar hankali. Koyaushe ka amsa da kulawa, fahimta, da albarkatun da suka dace idan an buƙata. Ka kiyaye amsoshi gajeru amma masu ma'ana.${moodContext}`,
        };
        return prompts[language] || prompts.en;
    }

    /**
     * Get mood-specific context for system prompt
     * @param {string} mood - User's current mood
     * @param {string} language - Language code
     * @returns {string} - Mood context
     */
    getMoodContext(mood, language) {
        const moodContexts = {
            en: {
                excited:
                    " The user is currently feeling excited. Acknowledge their positive energy while being mindful of any underlying concerns.",
                happy: " The user is currently feeling happy. Celebrate with them while remaining supportive and available for any concerns.",
                calm: " The user is currently feeling calm. This is a good state for reflection and deeper conversation.",
                neutral:
                    " The user is currently feeling neutral. This is a good time to check in and see how they're doing.",
                anxious:
                    " The user is currently feeling anxious. Be extra gentle, reassuring, and focus on calming techniques.",
                sad: " The user is currently feeling sad. Be especially empathetic and offer comfort and support.",
                angry: " The user is currently feeling angry. Be patient, non-confrontational, and help them process their feelings safely.",
                grateful:
                    " The user is currently feeling grateful. Acknowledge their gratitude while being supportive of their overall wellbeing.",
            },
            pidgin: {
                excited:
                    " Di user dey feel excited right now. Acknowledge dia positive energy but still dey mindful of any concerns wey fit dey underneath.",
                happy: " Di user dey feel happy right now. Celebrate with dem but still remain supportive and available for any concerns.",
                calm: " Di user dey feel calm right now. Dis na good state for reflection and deeper conversation.",
                neutral:
                    " Di user dey feel neutral right now. Dis na good time to check in and see how dem dey do.",
                anxious:
                    " Di user dey feel anxious right now. Be extra gentle, reassuring, and focus on calming techniques.",
                sad: " Di user dey feel sad right now. Be especially empathetic and offer comfort and support.",
                angry: " Di user dey feel angry right now. Be patient, no confrontational, and help dem process dia feelings safely.",
                grateful:
                    " Di user dey feel grateful right now. Acknowledge dia gratitude while being supportive of dia overall wellbeing.",
            },
            hausa: {
                excited:
                    " Mai amfani yana jin farin ciki a yanzu. Ka yarda da kuzarinsa mai kyau yayin da kake kula da duk wani damuwa da zai iya kasancewa.",
                happy: " Mai amfani yana jin farin ciki a yanzu. Ka yi murna tare da shi yayin da kake ci gaba da tallafawa da kasancewa don duk wani damuwa.",
                calm: " Mai amfani yana jin natsuwa a yanzu. Wannan yanayi ne mai kyau don tunani da tattaunawa mai zurfi.",
                neutral:
                    " Mai amfani yana jin tsaka-tsaki a yanzu. Wannan lokaci ne mai kyau don duba yadda yake.",
                anxious:
                    " Mai amfani yana jin damuwa a yanzu. Ka kasance mai tausayi, mai kwanciyar hankali, kuma ka mai da hankali kan dabarun kwantar da hankali.",
                sad: " Mai amfani yana jin baƙin ciki a yanzu. Ka kasance mai tausayi musamman kuma ka ba da ta'aziyya da tallafi.",
                angry: " Mai amfani yana jin fushi a yanzu. Ka kasance mai haƙuri, ba mai adawa ba, kuma ka taimaka masa ya sarrafa tunaninsa cikin aminci.",
                grateful:
                    " Mai amfani yana jin godiya a yanzu. Ka yarda da godiyarsa yayin da kake tallafawa lafiyarsa gaba ɗaya.",
            },
        };

        return moodContexts[language]?.[mood] || moodContexts.en[mood] || "";
    }

    /**
     * Check if message is a greeting
     * @param {string} message - Lowercase message
     * @param {string} language - Language code
     * @returns {boolean} - True if greeting
     */
    isGreeting(message, language) {
        const greetings = {
            en: [
                "hello",
                "hi",
                "hey",
                "good morning",
                "good afternoon",
                "good evening",
            ],
            pidgin: ["hello", "hi", "how you dey", "wetin dey happen", "abeg"],
            hausa: ["sannu", "barka", "yaya kuke", "ina kwana"],
        };

        const langGreetings = greetings[language] || greetings.en;
        return langGreetings.some((greeting) => message.includes(greeting));
    }

    /**
     * Check if message indicates negative emotions
     * @param {string} message - Lowercase message
     * @param {string} language - Language code
     * @returns {boolean} - True if negative emotion
     */
    isNegativeEmotion(message, language) {
        const negativeWords = {
            en: [
                "sad",
                "depressed",
                "anxious",
                "worried",
                "stressed",
                "tired",
                "overwhelmed",
                "hopeless",
            ],
            pidgin: [
                "sad",
                "i dey worry",
                "i dey stress",
                "i dey tired",
                "i no fit",
                "i dey suffer",
            ],
            hausa: [
                "ina bakin ciki",
                "ina damuwa",
                "na gaji",
                "ina tsoro",
                "ba zan iya",
            ],
        };

        const langWords = negativeWords[language] || negativeWords.en;
        return langWords.some((word) => message.includes(word));
    }

    /**
     * Check if message indicates positive emotions
     * @param {string} message - Lowercase message
     * @param {string} language - Language code
     * @returns {boolean} - True if positive emotion
     */
    isPositiveEmotion(message, language) {
        const positiveWords = {
            en: [
                "happy",
                "good",
                "great",
                "better",
                "fine",
                "okay",
                "alright",
                "excited",
            ],
            pidgin: [
                "i dey fine",
                "i dey good",
                "i dey happy",
                "e go better",
                "i dey okay",
            ],
            hausa: [
                "ina farin ciki",
                "na gode",
                "lafiya",
                "da kyau",
                "na ji daɗi",
            ],
        };

        const langWords = positiveWords[language] || positiveWords.en;
        return langWords.some((word) => message.includes(word));
    }

    /**
     * Get positive response
     * @param {string} language - Language code
     * @returns {string} - Positive response
     */
    getPositiveResponse(language) {
        const responses = {
            en: "I'm glad to hear you're doing well! It's wonderful that you're feeling positive. Is there anything specific you'd like to talk about or work on?",
            pidgin: "I dey happy to hear say you dey fine! E good say you dey feel positive. Get anything specific wey you wan talk about?",
            hausa: "Ina farin ciki da jin cewa kuna lafiya! Yana da kyau cewa kuna jin daɗi. Akwai wani abu na musamman da kuke so ku tattauna ko ku yi aiki da shi?",
        };
        return responses[language] || responses.en;
    }

    /**
     * Get fallback response
     * @param {string} language - Language code
     * @returns {Object} - Fallback response
     */
    getFallbackResponse(language) {
        const templates =
            this.responseTemplates[language] || this.responseTemplates.en;

        return {
            message: templates.support[0],
            language,
            sentiment: "neutral",
            crisisDetected: false,
            confidence: 0.5,
            metadata: {
                responseTime: Date.now(),
                model: "fallback",
                version: "1.0.0",
            },
        };
    }
}

module.exports = new ChatbotService();
