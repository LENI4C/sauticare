const natural = require("natural");
const logger = require("../utils/logger");

class CrisisDetectionService {
    constructor() {
        // Crisis keywords with severity levels
        this.crisisKeywords = {
            critical: [
                "suicide",
                "kill myself",
                "end it all",
                "not worth living",
                "want to die",
                "better off dead",
                "harm myself",
                "hurt myself",
                "jump off",
                "overdose",
                "cut myself",
                "bleed out",
                "final goodbye",
                "last time",
                "goodbye forever",
            ],
            high: [
                "hopeless",
                "no point",
                "give up",
                "can't go on",
                "desperate",
                "trapped",
                "no way out",
                "helpless",
                "worthless",
                "burden",
                "everyone hates me",
                "alone",
                "crying all day",
                "can't sleep",
                "can't eat",
                "panic attack",
                "anxiety attack",
                "breakdown",
            ],
            medium: [
                "depressed",
                "sad all time",
                "crying",
                "miserable",
                "stressed out",
                "overwhelmed",
                "anxious",
                "worried",
                "scared",
                "afraid",
                "fear",
                "nervous",
                "tired",
                "exhausted",
                "burned out",
                "drained",
            ],
            low: [
                "down",
                "blue",
                "upset",
                "disappointed",
                "frustrated",
                "annoyed",
                "bothered",
                "concerned",
                "troubled",
                "uncomfortable",
                "uneasy",
            ],
        };

        // Nigerian Pidgin crisis terms
        this.pidginCrisisKeywords = {
            critical: [
                "i wan die",
                "i go kill myself",
                "i no fit again",
                "make i die",
                "i go end am",
                "i go finish myself",
                "i wan end everything",
                "i go hurt myself",
            ],
            high: [
                "i don tire",
                "i no fit again",
                "i don give up",
                "wetin be the use",
                "i no see hope",
                "i don lose hope",
                "i dey alone",
                "nobody dey for me",
                "i dey suffer",
            ],
            medium: [
                "i dey sad",
                "i dey cry",
                "i dey worry",
                "i dey fear",
                "i dey stress",
                "i dey tired",
                "i no dey sleep",
                "i no dey eat",
            ],
        };

        // Hausa crisis terms
        this.hausaCrisisKeywords = {
            critical: [
                "ina so in mutu",
                "ina so in kashe kaina",
                "ba zan iya ba",
                "ina so in gama",
                "ina so in ci kansa",
            ],
            high: [
                "na gaji",
                "ba zan iya ba",
                "na yi gajiya",
                "ba ni da bege",
                "na rasa bege",
                "ina shi kadai",
                "ba ni da taimako",
            ],
            medium: [
                "ina bakin ciki",
                "ina kuka",
                "ina damuwa",
                "ina tsoro",
                "ina damu",
                "na gaji",
                "ba zan iya barci ba",
                "ba zan iya ci ba",
            ],
        };

        // Initialize tokenizer
        this.tokenizer = new natural.WordTokenizer();

        // Initialize stemmer
        this.stemmer = natural.PorterStemmer;
    }

    /**
     * Analyze text for crisis indicators
     * @param {string} text - Input text to analyze
     * @param {string} language - Language code (en, pidgin, hausa)
     * @returns {Object} - Crisis analysis results
     */
    analyzeCrisis(text, language = "en") {
        try {
            if (!text || text.trim().length === 0) {
                return {
                    isCrisis: false,
                    level: "low",
                    score: 0,
                    keywords: [],
                    confidence: 0,
                };
            }

            const cleanText = text.toLowerCase().trim();
            const tokens = this.tokenizer.tokenize(cleanText);

            // Get language-specific keywords
            const keywords = this.getLanguageKeywords(language);

            // Analyze for crisis indicators
            const analysis = this.analyzeKeywords(cleanText, tokens, keywords);

            // Calculate overall crisis score
            const crisisScore = this.calculateCrisisScore(analysis);

            // Determine crisis level
            const crisisLevel = this.determineCrisisLevel(crisisScore);

            // Check for immediate danger patterns
            const immediateDanger = this.checkImmediateDanger(
                cleanText,
                language
            );

            const result = {
                isCrisis: crisisScore > 0.3 || immediateDanger,
                level: immediateDanger ? "critical" : crisisLevel,
                score: Math.min(crisisScore, 1),
                keywords: analysis.matchedKeywords,
                confidence: this.calculateConfidence(analysis, crisisScore),
                immediateDanger,
                recommendations: this.getRecommendations(
                    crisisLevel,
                    immediateDanger,
                    language
                ),
            };

            logger.info(
                `Crisis analysis completed: ${
                    result.isCrisis ? "CRISIS DETECTED" : "No crisis"
                }, Level: ${result.level}, Score: ${result.score}`
            );

            return result;
        } catch (error) {
            logger.error("Error in crisis detection:", error);
            return {
                isCrisis: false,
                level: "low",
                score: 0,
                keywords: [],
                confidence: 0,
                error: "Analysis failed",
            };
        }
    }

    /**
     * Get language-specific crisis keywords
     * @param {string} language - Language code
     * @returns {Object} - Crisis keywords for the language
     */
    getLanguageKeywords(language) {
        switch (language) {
            case "pidgin":
                return this.pidginCrisisKeywords;
            case "hausa":
                return this.hausaCrisisKeywords;
            default:
                return this.crisisKeywords;
        }
    }

    /**
     * Analyze text against crisis keywords
     * @param {string} text - Clean text
     * @param {Array} tokens - Tokenized text
     * @param {Object} keywords - Crisis keywords
     * @returns {Object} - Analysis results
     */
    analyzeKeywords(text, tokens, keywords) {
        const matchedKeywords = [];
        let totalMatches = 0;
        const levelMatches = { critical: 0, high: 0, medium: 0, low: 0 };

        Object.keys(keywords).forEach((level) => {
            keywords[level].forEach((keyword) => {
                // Check for exact phrase matches
                if (text.includes(keyword)) {
                    matchedKeywords.push({ keyword, level, type: "phrase" });
                    levelMatches[level]++;
                    totalMatches++;
                }
                // Check for individual word matches
                else {
                    const keywordTokens = keyword.split(" ");
                    const matches = keywordTokens.filter((token) =>
                        tokens.some(
                            (t) => t.includes(token) || token.includes(t)
                        )
                    );
                    if (matches.length === keywordTokens.length) {
                        matchedKeywords.push({ keyword, level, type: "words" });
                        levelMatches[level]++;
                        totalMatches++;
                    }
                }
            });
        });

        return {
            matchedKeywords,
            totalMatches,
            levelMatches,
        };
    }

    /**
     * Calculate crisis score based on analysis
     * @param {Object} analysis - Analysis results
     * @returns {number} - Crisis score (0-1)
     */
    calculateCrisisScore(analysis) {
        const weights = { critical: 1.0, high: 0.7, medium: 0.4, low: 0.2 };
        let weightedScore = 0;
        let totalWeight = 0;

        Object.keys(analysis.levelMatches).forEach((level) => {
            const matches = analysis.levelMatches[level];
            if (matches > 0) {
                weightedScore += matches * weights[level];
                totalWeight += matches;
            }
        });

        return totalWeight > 0 ? Math.min(weightedScore / totalWeight, 1) : 0;
    }

    /**
     * Determine crisis level based on score
     * @param {number} score - Crisis score
     * @returns {string} - Crisis level
     */
    determineCrisisLevel(score) {
        if (score >= 0.8) return "critical";
        if (score >= 0.6) return "high";
        if (score >= 0.4) return "medium";
        return "low";
    }

    /**
     * Check for immediate danger patterns
     * @param {string} text - Clean text
     * @param {string} language - Language code
     * @returns {boolean} - True if immediate danger detected
     */
    checkImmediateDanger(text, language) {
        const dangerPatterns = [
            /right now/i,
            /immediately/i,
            /today/i,
            /tonight/i,
            /this moment/i,
            /as we speak/i,
        ];

        const hasDangerKeywords = this.analyzeKeywords(
            text,
            this.tokenizer.tokenize(text),
            this.getLanguageKeywords(language)
        );
        const hasCriticalKeywords = hasDangerKeywords.levelMatches.critical > 0;
        const hasDangerTiming = dangerPatterns.some((pattern) =>
            pattern.test(text)
        );

        return hasCriticalKeywords && hasDangerTiming;
    }

    /**
     * Calculate confidence score
     * @param {Object} analysis - Analysis results
     * @param {number} crisisScore - Crisis score
     * @returns {number} - Confidence score (0-1)
     */
    calculateConfidence(analysis, crisisScore) {
        const keywordConfidence = Math.min(analysis.totalMatches / 5, 1);
        const scoreConfidence = crisisScore;
        return (keywordConfidence + scoreConfidence) / 2;
    }

    /**
     * Get recommendations based on crisis level
     * @param {string} level - Crisis level
     * @param {boolean} immediateDanger - Immediate danger flag
     * @param {string} language - Language code
     * @returns {Array} - Recommendations
     */
    getRecommendations(level, immediateDanger, language) {
        const recommendations = [];

        if (immediateDanger || level === "critical") {
            recommendations.push({
                type: "immediate_action",
                message: this.getImmediateActionMessage(language),
                priority: "urgent",
            });
        }

        if (level === "high" || level === "critical") {
            recommendations.push({
                type: "professional_help",
                message: this.getProfessionalHelpMessage(language),
                priority: "high",
            });
        }

        if (level === "medium" || level === "high") {
            recommendations.push({
                type: "coping_strategies",
                message: this.getCopingStrategiesMessage(language),
                priority: "medium",
            });
        }

        return recommendations;
    }

    /**
     * Get immediate action message in appropriate language
     * @param {string} language - Language code
     * @returns {string} - Immediate action message
     */
    getImmediateActionMessage(language) {
        const messages = {
            en: "I'm very concerned about you. Please contact emergency services immediately or call the crisis hotline at +234-806-210-0053.",
            pidgin: "I dey worry about you well well. Abeg call emergency number now now or call +234-806-210-0053.",
            hausa: "Ina damu da ku sosai. Don Allah ku kira lambar gaggawa nan da nan ko ku kira +234-806-210-0053.",
        };
        return messages[language] || messages.en;
    }

    /**
     * Get professional help message in appropriate language
     * @param {string} language - Language code
     * @returns {string} - Professional help message
     */
    getProfessionalHelpMessage(language) {
        const messages = {
            en: "I strongly recommend speaking with a mental health professional. They can provide the support and guidance you need.",
            pidgin: "I dey recommend say you talk to mental health doctor. Dem fit help you well well.",
            hausa: "Ina ba da shawarar ku tattauna da likitan lafiyar hankali. Zai iya ba ku tallafi da jagora da kuke bukata.",
        };
        return messages[language] || messages.en;
    }

    /**
     * Get coping strategies message in appropriate language
     * @param {string} language - Language code
     * @returns {string} - Coping strategies message
     */
    getCopingStrategiesMessage(language) {
        const messages = {
            en: "Let's work on some coping strategies together. Deep breathing and grounding techniques can help you feel more centered.",
            pidgin: "Make we work on some things wey go help you. Deep breathing fit help you feel better.",
            hausa: "Bari mu yi aiki tare da wasu dabaru na jurewa. Numfashi mai zurfi zai iya taimaka muku ji daɗi.",
        };
        return messages[language] || messages.en;
    }
}

module.exports = new CrisisDetectionService();
