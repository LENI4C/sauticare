"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff } from "lucide-react";

interface InputBoxProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}

export default function InputBox({
    onSendMessage,
    disabled = false,
}: InputBoxProps) {
    const [message, setMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage("");
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

    return (
        <div className="border-t border-secondary-200 bg-white p-4">
            <form onSubmit={handleSubmit} className="flex items-end space-x-3">
                {/* Voice Recording Button */}
                <button
                    type="button"
                    onClick={toggleRecording}
                    disabled={disabled}
                    className={`p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        isRecording
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
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
                <div className="mt-3 flex items-center space-x-2 text-sm text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Recording... Click to stop</span>
                </div>
            )}

            {/* Accessibility Notice */}
            <div className="mt-2 text-xs text-secondary-400 text-center">
                Your conversations are private and secure. Press Enter to send,
                Shift+Enter for new line.
            </div>
        </div>
    );
}
