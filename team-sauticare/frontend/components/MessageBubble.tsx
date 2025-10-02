"use client";

import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
    message: string;
    isUser: boolean;
    timestamp: Date;
    isTyping?: boolean;
}

export default function MessageBubble({
    message,
    isUser,
    timestamp,
    isTyping = false,
}: MessageBubbleProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div
            className={`flex items-start space-x-3 mb-4 ${
                isUser ? "flex-row-reverse space-x-reverse" : ""
            }`}
        >
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isUser
                        ? "bg-primary-500 text-white"
                        : "bg-secondary-200 text-secondary-600"
                }`}
            >
                {isUser ? (
                    <User className="w-4 h-4" />
                ) : (
                    <Bot className="w-4 h-4" />
                )}
            </div>

            {/* Message Content */}
            <div
                className={`flex flex-col ${
                    isUser ? "items-end" : "items-start"
                }`}
            >
                <div
                    className={`message-bubble ${
                        isUser ? "message-user" : "message-bot"
                    } animate-slide-up`}
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
                        <p className="whitespace-pre-wrap">{message}</p>
                    )}
                </div>

                {/* Timestamp */}
                <span className="text-xs text-secondary-400 mt-1 px-2">
                    {formatTime(timestamp)}
                </span>
            </div>
        </div>
    );
}
