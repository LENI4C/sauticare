"use client";

import { useState } from "react";
import { Smile, Frown, Meh, Heart, Zap, Cloud, Sun } from "lucide-react";

interface MoodTrackerProps {
    onMoodSelect?: (mood: string) => void;
    currentMood?: string;
}

const moods = [
    {
        id: "excited",
        label: "Excited",
        icon: "🤩",
        color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
        iconComponent: Sun,
    },
    {
        id: "happy",
        label: "Happy",
        icon: "😊",
        color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
        iconComponent: Smile,
    },
    {
        id: "calm",
        label: "Calm",
        icon: "😌",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
        iconComponent: Cloud,
    },
    {
        id: "neutral",
        label: "Neutral",
        icon: "😐",
        color: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300",
        iconComponent: Meh,
    },
    {
        id: "anxious",
        label: "Anxious",
        icon: "😰",
        color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
        iconComponent: Zap,
    },
    {
        id: "sad",
        label: "Sad",
        icon: "😢",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
        iconComponent: Frown,
    },
    {
        id: "angry",
        label: "Angry",
        icon: "😠",
        color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
        iconComponent: Frown,
    },
    {
        id: "grateful",
        label: "Grateful",
        icon: "🙏",
        color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
        iconComponent: Heart,
    },
];

export default function MoodTracker({
    onMoodSelect,
    currentMood,
}: MoodTrackerProps) {
    const [selectedMood, setSelectedMood] = useState(currentMood || "");

    const handleMoodClick = (moodId: string) => {
        setSelectedMood(moodId);
        onMoodSelect?.(moodId);
    };

    return (
        <div className="p-4 bg-gradient-to-r from-primary-50 to-calm-50 dark:from-primary-900/10 dark:to-calm-900/10 rounded-xl border border-primary-200/50 dark:border-primary-700/50">
            <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
                    How are you feeling right now?
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Select your current mood to help me understand you better
                </p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {moods.map((mood) => {
                    const IconComponent = mood.iconComponent;
                    const isSelected = selectedMood === mood.id;

                    return (
                        <button
                            key={mood.id}
                            onClick={() => handleMoodClick(mood.id)}
                            className={`mood-indicator ${mood.color} ${
                                isSelected
                                    ? "ring-2 ring-primary-500 scale-110 shadow-glow"
                                    : "hover:scale-105"
                            } transition-all duration-200`}
                            aria-label={`Select ${mood.label} mood`}
                        >
                            <span className="text-2xl">{mood.icon}</span>
                        </button>
                    );
                })}
            </div>

            {selectedMood && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        You're feeling{" "}
                        <span className="font-medium text-primary-600 dark:text-primary-400">
                            {moods.find((m) => m.id === selectedMood)?.label}
                        </span>
                    </p>
                </div>
            )}

            {/* Mood Tips */}
            <div className="mt-4 p-3 bg-white/60 dark:bg-secondary-800/60 rounded-lg">
                <h4 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    💡 Mood Tips
                </h4>
                <p className="text-xs text-secondary-600 dark:text-secondary-400">
                    Your mood helps me provide more personalized support. Feel
                    free to update it anytime during our conversation.
                </p>
            </div>
        </div>
    );
}
