"use client";

import {
    Bot,
    User,
    Heart,
    Smile,
    Frown,
    Meh,
    AlertTriangle,
} from "lucide-react";

interface MessageBubbleProps {
    message: string;
    isUser: boolean;
    timestamp: Date;
    isTyping?: boolean;
    language?: string;
    sentiment?: string;
    crisisDetected?: boolean;
    crisisLevel?: string;
}

export default function MessageBubble({
    message,
    isUser,
    timestamp,
    isTyping = false,
    language,
    sentiment,
    crisisDetected,
    crisisLevel,
}: MessageBubbleProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getSentimentIcon = (sentiment?: string) => {
        switch (sentiment?.toLowerCase()) {
            case "positive":
                return <Smile className="w-3 h-3 text-success-500" />;
            case "negative":
                return <Frown className="w-3 h-3 text-danger-500" />;
            case "neutral":
                return <Meh className="w-3 h-3 text-secondary-500" />;
            default:
                return null;
        }
    };

    const getLanguageFlag = (lang?: string) => {
        switch (lang?.toLowerCase()) {
            case "en":
                return "🇺🇸";
            case "pidgin":
                return "🇳🇬";
            case "hausa":
                return "🇳🇬";
            default:
                return null;
        }
    };

    return (
        <div
            className={`flex items-start space-x-3 mb-4 ${
                isUser ? "flex-row-reverse space-x-reverse" : ""
            }`}
        >
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-soft transition-all duration-300 hover:scale-105 ${
                    isUser
                        ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white"
                        : "bg-gradient-to-br from-secondary-200 to-secondary-300 text-secondary-700 dark:from-secondary-700 dark:to-secondary-600 dark:text-secondary-200"
                }`}
            >
                {isUser ? (
                    <User className="w-5 h-5" />
                ) : (
                    <Bot className="w-5 h-5" />
                )}
            </div>

            {/* Message Content */}
            <div
                className={`flex flex-col max-w-[80%] ${
                    isUser ? "items-end" : "items-start"
                }`}
            >
                <div
                    className={`message-bubble ${
                        isUser ? "message-user" : "message-bot"
                    } animate-slide-up group relative`}
                >
                    {isTyping ? (
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse-soft"></div>
                            <div
                                className="w-2 h-2 bg-current rounded-full animate-pulse-soft"
                                style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                                className="w-2 h-2 bg-current rounded-full animate-pulse-soft"
                                style={{ animationDelay: "0.4s" }}
                            ></div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="whitespace-pre-wrap leading-relaxed">
                                {message}
                            </p>

                            {/* Crisis Warning */}
                            {crisisDetected && crisisLevel && (
                                <div
                                    className={`mt-2 p-2 rounded-lg text-xs font-medium ${
                                        crisisLevel === "critical"
                                            ? "bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-200"
                                            : "bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-200"
                                    }`}
                                >
                                    <div className="flex items-center space-x-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        <span>
                                            {crisisLevel === "critical"
                                                ? "Crisis Detected"
                                                : "Concern Detected"}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Message Metadata */}
                <div
                    className={`flex items-center space-x-2 mt-1 px-2 ${
                        isUser ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                >
                    {/* Timestamp */}
                    <span className="text-xs text-secondary-400 dark:text-secondary-500">
                        {formatTime(timestamp)}
                    </span>

                    {/* Language Indicator */}
                    {language && !isUser && (
                        <span className="text-xs text-secondary-400 dark:text-secondary-500">
                            {getLanguageFlag(language)}
                        </span>
                    )}

                    {/* Sentiment Indicator */}
                    {sentiment && !isUser && (
                        <div className="flex items-center space-x-1">
                            {getSentimentIcon(sentiment)}
                        </div>
                    )}

                    {/* Heart indicator for bot messages */}
                    {!isUser && !isTyping && (
                        <Heart className="w-3 h-3 text-primary-400 opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
                    )}
                </div>
            </div>
        </div>
    );
}
