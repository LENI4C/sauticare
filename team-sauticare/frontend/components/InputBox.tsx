"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Smile, Heart, HelpCircle, Zap } from "lucide-react";

interface InputBoxProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}

const quickActions = [
    {
        text: "I'm feeling anxious",
        icon: "😰",
        color: "bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-300",
    },
    {
        text: "I need help",
        icon: "🆘",
        color: "bg-danger-100 text-danger-700 dark:bg-danger-900/20 dark:text-danger-300",
    },
    {
        text: "I'm feeling sad",
        icon: "😢",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
    },
    {
        text: "I'm stressed",
        icon: "😤",
        color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
    },
    {
        text: "I'm grateful",
        icon: "🙏",
        color: "bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-300",
    },
    {
        text: "How are you?",
        icon: "💙",
        color: "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300",
    },
];

export default function InputBox({
    onSendMessage,
    disabled = false,
}: InputBoxProps) {
    const [message, setMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage("");
            setShowQuickActions(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                120
            )}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [message]);

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        // TODO: Implement voice recording functionality
    };

    const handleQuickAction = (actionText: string) => {
        setMessage(actionText);
        setShowQuickActions(false);
        textareaRef.current?.focus();
    };

    return (
        <div className="border-t border-secondary-200/50 dark:border-secondary-700/50 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm p-4">
            {/* Quick Actions */}
            {showQuickActions && (
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-xl animate-slide-down">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                            Quick Actions
                        </h3>
                        <button
                            onClick={() => setShowQuickActions(false)}
                            className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickAction(action.text)}
                                className={`quick-action ${action.color} hover:scale-105 active:scale-95`}
                            >
                                <span className="mr-2">{action.icon}</span>
                                {action.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-end space-x-3">
                {/* Quick Actions Toggle */}
                <button
                    type="button"
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    disabled={disabled}
                    className={`p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        showQuickActions
                            ? "bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                            : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-400 dark:hover:bg-secondary-600"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label="Quick actions"
                >
                    <Zap className="w-5 h-5" />
                </button>

                {/* Voice Recording Button */}
                <button
                    type="button"
                    onClick={toggleRecording}
                    disabled={disabled}
                    className={`p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        isRecording
                            ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-400 dark:hover:bg-secondary-600"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label={
                        isRecording ? "Stop recording" : "Start voice recording"
                    }
                >
                    {isRecording ? (
                        <MicOff className="w-5 h-5" />
                    ) : (
                        <Mic className="w-5 h-5" />
                    )}
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        disabled={disabled}
                        className="input-field resize-none min-h-[48px] max-h-[120px] pr-12"
                        rows={1}
                        aria-label="Type your message"
                        aria-describedby="input-help"
                    />

                    {/* Character count for accessibility */}
                    <div id="input-help" className="sr-only">
                        Press Enter to send, Shift+Enter for new line
                    </div>
                </div>

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={disabled || !message.trim()}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                </button>
            </form>

            {/* Recording Indicator */}
            {isRecording && (
                <div className="mt-3 flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 animate-pulse">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Recording... Click to stop</span>
                </div>
            )}

            {/* Accessibility Notice */}
            <div className="mt-2 text-xs text-secondary-400 dark:text-secondary-500 text-center">
                Your conversations are private and secure. Press Enter to send,
                Shift+Enter for new line.
            </div>
        </div>
    );
}
