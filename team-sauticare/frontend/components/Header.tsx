"use client";

import { useState, useEffect } from "react";
import { Heart, Shield, Moon, Sun, Settings, HelpCircle } from "lucide-react";

export default function Header() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);

        if (newTheme) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-secondary-200/50 px-6 py-4 sticky top-0 z-50">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
                {/* Logo and Title */}
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-xl shadow-soft animate-float">
                        <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-secondary-800 dark:text-secondary-100">
                            SautiCare
                        </h1>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                            Your mental health companion
                        </p>
                    </div>
                </div>

                {/* Right side controls */}
                <div className="flex items-center space-x-4">
                    {/* Privacy Indicator */}
                    <div className="hidden sm:flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                        <Shield className="w-4 h-4" />
                        <span>Secure & Private</span>
                    </div>

                    {/* Help Button */}
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200"
                        aria-label="Help and settings"
                    >
                        <HelpCircle className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-all duration-200 hover:scale-105"
                        aria-label={
                            isDarkMode
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                    >
                        {isDarkMode ? (
                            <Sun className="w-5 h-5 text-warm-500" />
                        ) : (
                            <Moon className="w-5 h-5 text-secondary-600" />
                        )}
                    </button>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-secondary-800/95 backdrop-blur-sm border-b border-secondary-200/50 dark:border-secondary-700/50 p-4 animate-slide-down">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-secondary-800 dark:text-secondary-200">
                                    Privacy & Security
                                </h3>
                                <p className="text-secondary-600 dark:text-secondary-400">
                                    Your conversations are encrypted and never
                                    shared with third parties.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-secondary-800 dark:text-secondary-200">
                                    Crisis Support
                                </h3>
                                <p className="text-secondary-600 dark:text-secondary-400">
                                    If you're in immediate danger, please
                                    contact emergency services.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-secondary-800 dark:text-secondary-200">
                                    Multilingual Support
                                </h3>
                                <p className="text-secondary-600 dark:text-secondary-400">
                                    Available in English, Pidgin, and Hausa.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
