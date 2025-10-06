const franc = require("franc");
const logger = require("../utils/logger");

class LanguageDetectionService {
    constructor() {
        this.supportedLanguages = {
            eng: "en",
            pcm: "pidgin", // Nigerian Pidgin
            hau: "hausa",
        };

        // Custom patterns for better detection
        this.patterns = {
            pidgin: [
                /how you dey/i,
                /wetin dey happen/i,
                /no worry/i,
                /e go better/i,
                /abeg/i,
                /sha/i,
                /o/i,
                /na wa/i,
                /chai/i,
                /guy/i,
            ],
            hausa: [
                /yaya kuke/i,
                /ina farin ciki/i,
                /na gode/i,
                /barka/i,
                /sannu/i,
                /ina kwana/i,
                /ina zuwa/i,
                /ina tafi/i,
                /ina so/i,
                /ba zan iya/i,
            ],
            en: [
                /how are you/i,
                /what's wrong/i,
                /i feel/i,
                /i am/i,
                /i have/i,
                /thank you/i,
                /please/i,
                /help me/i,
                /i need/i,
                /can you/i,
            ],
        };
    }

    /**
     * Detect the language of the input text
     * @param {string} text - Input text to analyze
     * @returns {string} - Detected language code (en, pidgin, hausa)
     */
    detectLanguage(text) {
        try {
            if (!text || text.trim().length === 0) {
                return "en"; // Default to English
            }

            // Clean the text
            const cleanText = text.trim().toLowerCase();

            // Check for custom patterns first (more reliable for Nigerian languages)
            const patternScores = this.checkPatterns(cleanText);
            const bestPatternMatch = this.getBestPatternMatch(patternScores);

            if (bestPatternMatch && bestPatternMatch.score > 0.3) {
                logger.info(
                    `Language detected via patterns: ${bestPatternMatch.language}`
                );
                return bestPatternMatch.language;
            }

            // Use franc for general language detection
            const detectedLang = franc(cleanText);
            const mappedLang = this.supportedLanguages[detectedLang];

            if (mappedLang) {
                logger.info(`Language detected via franc: ${mappedLang}`);
                return mappedLang;
            }

            // Fallback to pattern-based detection with lower threshold
            if (bestPatternMatch && bestPatternMatch.score > 0.1) {
                return bestPatternMatch.language;
            }

            // Default to English
            logger.info("Language detection fallback to English");
            return "en";
        } catch (error) {
            logger.error("Error in language detection:", error);
            return "en"; // Safe fallback
        }
    }

    /**
     * Check text against custom language patterns
     * @param {string} text - Clean text to check
     * @returns {Object} - Scores for each language
     */
    checkPatterns(text) {
        const scores = {
            en: 0,
            pidgin: 0,
            hausa: 0,
        };

        Object.keys(this.patterns).forEach((lang) => {
            this.patterns[lang].forEach((pattern) => {
                if (pattern.test(text)) {
                    scores[lang] += 1;
                }
            });
        });

        return scores;
    }

    /**
     * Get the best pattern match
     * @param {Object} scores - Pattern scores
     * @returns {Object|null} - Best match with language and score
     */
    getBestPatternMatch(scores) {
        let bestMatch = null;
        let maxScore = 0;

        Object.keys(scores).forEach((lang) => {
            if (scores[lang] > maxScore) {
                maxScore = scores[lang];
                bestMatch = { language: lang, score: scores[lang] };
            }
        });

        return bestMatch;
    }

    /**
     * Get confidence score for language detection
     * @param {string} text - Input text
     * @returns {Object} - Language and confidence score
     */
    getLanguageWithConfidence(text) {
        const language = this.detectLanguage(text);
        const patternScores = this.checkPatterns(text.toLowerCase());
        const totalPatterns = Object.values(patternScores).reduce(
            (sum, score) => sum + score,
            0
        );

        let confidence = 0.5; // Default confidence

        if (totalPatterns > 0) {
            const maxScore = Math.max(...Object.values(patternScores));
            confidence = Math.min(maxScore / 3, 1); // Normalize to 0-1
        }

        return {
            language,
            confidence: Math.round(confidence * 100) / 100,
        };
    }

    /**
     * Check if text contains mixed languages
     * @param {string} text - Input text
     * @returns {boolean} - True if mixed languages detected
     */
    isMixedLanguage(text) {
        const sentences = text
            .split(/[.!?]+/)
            .filter((s) => s.trim().length > 0);
        if (sentences.length < 2) return false;

        const languages = sentences.map((sentence) =>
            this.detectLanguage(sentence)
        );
        const uniqueLanguages = [...new Set(languages)];

        return uniqueLanguages.length > 1;
    }
}

module.exports = new LanguageDetectionService();
