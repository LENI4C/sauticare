"use client";

import { useState, useCallback } from "react";
import Header from "./Header";
import ChatWindow from "./ChatWindow";
import InputBox from "./InputBox";

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export default function ChatContainer() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    // Placeholder responses for demonstration
    const getBotResponse = (userMessage: string): string => {
        const responses = [
            "I understand you're going through a difficult time. Can you tell me more about what's been on your mind?",
            "Thank you for sharing that with me. It takes courage to open up about your feelings.",
            "I'm here to listen and support you. What would be most helpful for you right now?",
            "It sounds like you're dealing with a lot. Remember, it's okay to feel overwhelmed sometimes.",
            "Would you like to talk about some coping strategies that might help you feel better?",
            "I appreciate you trusting me with your thoughts. You're not alone in this.",
            "Let's take this one step at a time. What's one small thing that might help you right now?",
            "Your feelings are valid, and it's important to acknowledge them. How are you taking care of yourself?",
        ];

        // Simple keyword-based responses (in a real app, this would be AI-powered)
        const lowerMessage = userMessage.toLowerCase();

        if (
            lowerMessage.includes("anxiety") ||
            lowerMessage.includes("worried")
        ) {
            return "I hear that you're feeling anxious. Anxiety can be overwhelming, but there are ways to manage it. Would you like to try some breathing exercises together?";
        }

        if (
            lowerMessage.includes("sad") ||
            lowerMessage.includes("depressed")
        ) {
            return "I'm sorry you're feeling sad. Depression can make everything feel heavy. Remember that these feelings are temporary, even when they don't feel that way. What's one thing that usually brings you comfort?";
        }

        if (
            lowerMessage.includes("stress") ||
            lowerMessage.includes("stressed")
        ) {
            return "Stress can really take a toll on our mental health. It sounds like you're dealing with a lot right now. What's causing you the most stress, and is there anything that usually helps you feel more grounded?";
        }

        if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
            return "I'm glad you're reaching out for help. That's a really important first step. What kind of support would be most helpful for you right now?";
        }

        // Default response
        return responses[Math.floor(Math.random() * responses.length)];
    };

    const handleSendMessage = useCallback(async (messageText: string) => {
        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        // Simulate bot thinking time
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: getBotResponse(messageText),
                isUser: false,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 2000); // 1-3 seconds delay
    }, []);

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-2xl">
            <Header />

            <div className="flex-1 flex flex-col overflow-hidden">
                <ChatWindow messages={messages} isTyping={isTyping} />
                <InputBox
                    onSendMessage={handleSendMessage}
                    disabled={isTyping}
                />
            </div>
        </div>
    );
}
