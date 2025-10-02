"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
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
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">💙</span>
                        </div>
                        <h2 className="text-xl font-semibold text-secondary-800 mb-2">
                            Welcome to SautiCare
                        </h2>
                        <p className="text-secondary-600 leading-relaxed">
                            I'm here to listen and support you. Feel free to
                            share what's on your mind, and I'll do my best to
                            help you through whatever you're experiencing.
                        </p>
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
