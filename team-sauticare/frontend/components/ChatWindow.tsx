"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    language?: string;
    sentiment?: string;
    crisisDetected?: boolean;
    crisisLevel?: string;
    recommendations?: any[];
}

interface ChatWindowProps {
    messages: Message[];
    isTyping: boolean;
}

export default function ChatWindow({ messages, isTyping }: ChatWindowProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            {/* Welcome Message */}
            {messages.length === 0 && (
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center max-w-md animate-fade-in-up">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow animate-float">
                            <span className="text-3xl">💙</span>
                        </div>
                        <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-100 mb-3">
                            Welcome to SautiCare
                        </h2>
                        <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-6">
                            I'm here to listen and support you. Feel free to
                            share what's on your mind, and I'll do my best to
                            help you through whatever you're experiencing.
                        </p>

                        {/* Quick Start Suggestions */}
                        <div className="space-y-2 text-sm">
                            <p className="text-secondary-500 dark:text-secondary-500 font-medium">
                                Try saying:
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-xs">
                                    "I'm feeling anxious"
                                </span>
                                <span className="px-3 py-1 bg-calm-100 dark:bg-calm-900/20 text-calm-700 dark:text-calm-300 rounded-full text-xs">
                                    "I need help"
                                </span>
                                <span className="px-3 py-1 bg-warm-100 dark:bg-warm-900/20 text-warm-700 dark:text-warm-300 rounded-full text-xs">
                                    "How are you?"
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 chat-messages">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message.text}
                            isUser={message.isUser}
                            timestamp={message.timestamp}
                            language={message.language}
                            sentiment={message.sentiment}
                            crisisDetected={message.crisisDetected}
                            crisisLevel={message.crisisLevel}
                        />
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <MessageBubble
                            message=""
                            isUser={false}
                            timestamp={new Date()}
                            isTyping={true}
                        />
                    )}
                </div>
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
