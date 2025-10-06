"use client";

import { useState } from "react";
import {
    BookOpen,
    Phone,
    Heart,
    Download,
    ExternalLink,
    X,
    Star,
} from "lucide-react";

interface Resource {
    id: string;
    title: string;
    description: string;
    type: "article" | "hotline" | "exercise" | "tool";
    category: string;
    url?: string;
    phone?: string;
    rating?: number;
    isEmergency?: boolean;
}

interface ResourcePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const resources: Resource[] = [
    {
        id: "1",
        title: "Crisis Hotline Nigeria",
        description: "24/7 mental health crisis support",
        type: "hotline",
        category: "Crisis Support",
        phone: "+234 800 201 0000",
        isEmergency: true,
        rating: 5,
    },
    {
        id: "2",
        title: "Breathing Exercise Guide",
        description: "Step-by-step breathing techniques for anxiety relief",
        type: "exercise",
        category: "Self-Care",
        rating: 4.8,
    },
    {
        id: "3",
        title: "Understanding Anxiety",
        description: "Comprehensive guide to anxiety disorders and management",
        type: "article",
        category: "Education",
        url: "#",
        rating: 4.6,
    },
    {
        id: "4",
        title: "Mood Tracking Tool",
        description: "Track your daily mood and emotional patterns",
        type: "tool",
        category: "Self-Care",
        rating: 4.7,
    },
    {
        id: "5",
        title: "Depression Support Group",
        description: "Connect with others who understand your journey",
        type: "article",
        category: "Community",
        url: "#",
        rating: 4.9,
    },
    {
        id: "6",
        title: "Emergency Services",
        description: "Immediate help for mental health emergencies",
        type: "hotline",
        category: "Crisis Support",
        phone: "199",
        isEmergency: true,
        rating: 5,
    },
];

export default function ResourcePanel({ isOpen, onClose }: ResourcePanelProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const categories = [
        "all",
        "Crisis Support",
        "Self-Care",
        "Education",
        "Community",
    ];
    const filteredResources =
        selectedCategory === "all"
            ? resources
            : resources.filter(
                  (resource) => resource.category === selectedCategory
              );

    const getResourceIcon = (type: string) => {
        switch (type) {
            case "hotline":
                return <Phone className="w-5 h-5" />;
            case "exercise":
                return <Heart className="w-5 h-5" />;
            case "article":
                return <BookOpen className="w-5 h-5" />;
            case "tool":
                return <Download className="w-5 h-5" />;
            default:
                return <BookOpen className="w-5 h-5" />;
        }
    };

    const getResourceColor = (type: string, isEmergency?: boolean) => {
        if (isEmergency)
            return "bg-danger-100 text-danger-700 dark:bg-danger-900/20 dark:text-danger-300";

        switch (type) {
            case "hotline":
                return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300";
            case "exercise":
                return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300";
            case "article":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
            case "tool":
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300";
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft-lg max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
                    <div>
                        <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-200">
                            Mental Health Resources
                        </h2>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                            Find support, tools, and information to help you on
                            your journey
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200"
                        aria-label="Close resources panel"
                    >
                        <X className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                    </button>
                </div>

                {/* Category Filter */}
                <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                    selectedCategory === category
                                        ? "bg-primary-500 text-white shadow-soft"
                                        : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-600"
                                }`}
                            >
                                {category === "all"
                                    ? "All Resources"
                                    : category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Resources List */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredResources.map((resource) => (
                            <div
                                key={resource.id}
                                className={`resource-card ${
                                    resource.isEmergency
                                        ? "ring-2 ring-danger-500"
                                        : ""
                                }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div
                                        className={`p-2 rounded-lg ${getResourceColor(
                                            resource.type,
                                            resource.isEmergency
                                        )}`}
                                    >
                                        {getResourceIcon(resource.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 text-sm">
                                                {resource.title}
                                            </h3>
                                            {resource.isEmergency && (
                                                <span className="text-xs bg-danger-100 text-danger-700 dark:bg-danger-900/20 dark:text-danger-300 px-2 py-1 rounded-full">
                                                    Emergency
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                                            {resource.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-secondary-500 dark:text-secondary-500">
                                                {resource.category}
                                            </span>
                                            {resource.rating && (
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-3 h-3 text-warm-500 fill-current" />
                                                    <span className="text-xs text-secondary-500 dark:text-secondary-500">
                                                        {resource.rating}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-3">
                                            {resource.phone ? (
                                                <a
                                                    href={`tel:${resource.phone}`}
                                                    className="inline-flex items-center space-x-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                                                >
                                                    <Phone className="w-3 h-3" />
                                                    <span>Call Now</span>
                                                </a>
                                            ) : resource.url ? (
                                                <a
                                                    href={resource.url}
                                                    className="inline-flex items-center space-x-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    <span>Learn More</span>
                                                </a>
                                            ) : (
                                                <button className="inline-flex items-center space-x-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                                                    <Download className="w-3 h-3" />
                                                    <span>Access</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50">
                    <div className="text-center">
                        <p className="text-xs text-secondary-600 dark:text-secondary-400">
                            💙 Remember: You're not alone. These resources are
                            here to support you.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
