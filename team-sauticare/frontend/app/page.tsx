import ChatContainer from "@/components/ChatContainer";

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-calm-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-4 h-4 bg-primary-300 rounded-full animate-float opacity-60"></div>
            <div
                className="absolute top-40 right-20 w-6 h-6 bg-accent-300 rounded-full animate-float opacity-40"
                style={{ animationDelay: "1s" }}
            ></div>
            <div
                className="absolute bottom-40 left-1/3 w-3 h-3 bg-calm-300 rounded-full animate-float opacity-50"
                style={{ animationDelay: "2s" }}
            ></div>
            <div
                className="absolute bottom-20 right-1/3 w-5 h-5 bg-warm-300 rounded-full animate-float opacity-30"
                style={{ animationDelay: "0.5s" }}
            ></div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <ChatContainer />
            </div>
        </main>
    );
}
