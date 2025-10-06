"use client";

import { useState, useCallback, useEffect } from "react";
import Header from "./Header";
import ChatWindow from "./ChatWindow";
import InputBox from "./InputBox";
import MoodTracker from "./MoodTracker";
import ResourcePanel from "./ResourcePanel";
import { BookOpen, AlertTriangle, X } from "lucide-react";

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

interface CrisisAlertProps {
    crisisLevel: string;
    recommendations: any[];
    onDismiss: () => void;
}

function CrisisAlert({
    crisisLevel,
    recommendations,
    onDismiss,
}: CrisisAlertProps) {
    const isCritical = crisisLevel === "critical";

    return (
        <div
            className={`crisis-alert ${
                isCritical ? "crisis-critical" : "crisis-warning"
            } animate-slide-down`}
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <span className="text-2xl">{isCritical ? "🚨" : "⚠️"}</span>
                </div>
                <div className="ml-3 flex-1">
                    <h3
                        className={`text-lg font-semibold ${
                            isCritical
                                ? "text-danger-800 dark:text-danger-200"
                                : "text-warning-800 dark:text-warning-200"
                        }`}
                    >
                        {isCritical ? "Crisis Detected" : "Concern Detected"}
                    </h3>
                    <p
                        className={`mt-1 text-sm ${
                            isCritical
                                ? "text-danger-700 dark:text-danger-300"
                                : "text-warning-700 dark:text-warning-300"
                        }`}
                    >
                        {isCritical
                            ? "We are very concerned about your safety. Please contact emergency services immediately."
                            : "We are concerned about your wellbeing. Please consider reaching out for support."}
                    </p>
                    {recommendations && recommendations.length > 0 && (
                        <div className="mt-3">
                            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                Immediate Actions:
                            </p>
                            <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                                {recommendations.map((rec, index) => (
                                    <li
                                        key={index}
                                        className="text-secondary-600 dark:text-secondary-400"
                                    >
                                        {rec.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="mt-4 flex space-x-3">
                        <button
                            onClick={onDismiss}
                            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                                isCritical
                                    ? "bg-danger-200 text-danger-800 hover:bg-danger-300 dark:bg-danger-800 dark:text-danger-200 dark:hover:bg-danger-700"
                                    : "bg-warning-200 text-warning-800 hover:bg-warning-300 dark:bg-warning-800 dark:text-warning-200 dark:hover:bg-warning-700"
                            }`}
                        >
                            I understand
                        </button>
                        {isCritical && (
                            <a
                                href="tel:+2348002010000"
                                className="px-4 py-2 text-sm rounded-lg font-medium bg-danger-500 text-white hover:bg-danger-600 transition-all duration-200"
                            >
                                Call Emergency
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ChatContainer() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [crisisAlert, setCrisisAlert] = useState<{
        crisisLevel: string;
        recommendations: any[];
    } | null>(null);
    const [language, setLanguage] = useState<string>("en");
    const [currentMood, setCurrentMood] = useState<string>("");
    const [showMoodTracker, setShowMoodTracker] = useState(false);
    const [showResourcePanel, setShowResourcePanel] = useState(false);

    // Initialize session on component mount
    useEffect(() => {
        initializeSession();
    }, []);

    const initializeSession = async () => {
        try {
            const response = await fetch("/api/chat/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    preferredLanguage: language,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSessionId(data.data.sessionId);

                // Add welcome message
                const welcomeMessage: Message = {
                    id: "welcome",
                    text: data.data.welcomeMessage,
                    isUser: false,
                    timestamp: new Date(),
                    language: data.data.language,
                };
                setMessages([welcomeMessage]);
            }
        } catch (error) {
            console.error("Failed to initialize session:", error);
            // Fallback to local welcome message
            const welcomeMessage: Message = {
                id: "welcome",
                text: "Hello! I'm here to listen and support you. How are you feeling today?",
                isUser: false,
                timestamp: new Date(),
                language: "en",
            };
            setMessages([welcomeMessage]);
        }
    };

    const handleSendMessage = useCallback(
        async (messageText: string) => {
            if (!sessionId) {
                console.error("No session ID available");
                return;
            }

            // Add user message
            const userMessage: Message = {
                id: Date.now().toString(),
                text: messageText,
                isUser: true,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setIsTyping(true);

            try {
                const response = await fetch("/api/chat/send", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: messageText,
                        sessionId: sessionId,
                        mood: currentMood,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();

                    const botResponse: Message = {
                        id: data.data.messageId || (Date.now() + 1).toString(),
                        text: data.data.message,
                        isUser: false,
                        timestamp: new Date(),
                        language: data.data.language,
                        sentiment: data.data.sentiment,
                        crisisDetected: data.data.crisisDetected,
                        crisisLevel: data.data.crisisLevel,
                        recommendations: data.data.recommendations,
                    };

                    setMessages((prev) => [...prev, botResponse]);

                    // Show crisis alert if crisis detected
                    if (data.data.crisisDetected && data.data.crisisLevel) {
                        setCrisisAlert({
                            crisisLevel: data.data.crisisLevel,
                            recommendations: data.data.recommendations || [],
                        });
                    }

                    // Update language if detected
                    if (data.data.language && data.data.language !== language) {
                        setLanguage(data.data.language);
                    }
                } else {
                    throw new Error("Failed to send message");
                }
            } catch (error) {
                console.error("Error sending message:", error);

                // Fallback response
                const fallbackResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "I'm sorry, I'm having trouble processing your message right now. Please try again.",
                    isUser: false,
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, fallbackResponse]);
            } finally {
                setIsTyping(false);
            }
        },
        [sessionId, language, currentMood]
    );

    const handleMoodSelect = (mood: string) => {
        setCurrentMood(mood);
        setShowMoodTracker(false);
    };

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto chat-container">
            <Header />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Crisis Alert */}
                {crisisAlert && (
                    <div className="p-4">
                        <CrisisAlert
                            crisisLevel={crisisAlert.crisisLevel}
                            recommendations={crisisAlert.recommendations}
                            onDismiss={() => setCrisisAlert(null)}
                        />
                    </div>
                )}

                {/* Mood Tracker */}
                {showMoodTracker && (
                    <div className="p-4">
                        <MoodTracker
                            onMoodSelect={handleMoodSelect}
                            currentMood={currentMood}
                        />
                    </div>
                )}

                <ChatWindow messages={messages} isTyping={isTyping} />
                <InputBox
                    onSendMessage={handleSendMessage}
                    disabled={isTyping}
                />
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute bottom-20 right-6 flex flex-col space-y-3">
                {/* Mood Tracker Button */}
                <button
                    onClick={() => setShowMoodTracker(!showMoodTracker)}
                    className="p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-soft-lg hover:shadow-glow transition-all duration-200 hover:scale-105"
                    aria-label="Track your mood"
                >
                    <span className="text-xl">😊</span>
                </button>

                {/* Resources Button */}
                <button
                    onClick={() => setShowResourcePanel(true)}
                    className="p-3 bg-accent-500 hover:bg-accent-600 text-white rounded-full shadow-soft-lg hover:shadow-glow transition-all duration-200 hover:scale-105"
                    aria-label="Open resources"
                >
                    <BookOpen className="w-5 h-5" />
                </button>
            </div>

            {/* Resource Panel */}
            <ResourcePanel
                isOpen={showResourcePanel}
                onClose={() => setShowResourcePanel(false)}
            />
        </div>
    );
}
