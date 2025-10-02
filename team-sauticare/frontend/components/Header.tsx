"use client";

import { Heart, Shield } from "lucide-react";

export default function Header() {
    return (
        <header className="bg-white border-b border-secondary-200 px-6 py-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
                {/* Logo and Title */}
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-xl">
                        <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-secondary-800">
                            SautiCare
                        </h1>
                        <p className="text-sm text-secondary-500">
                            Your mental health companion
                        </p>
                    </div>
                </div>

                {/* Privacy Indicator */}
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Secure & Private</span>
                </div>
            </div>
        </header>
    );
}
