import ChatContainer from "@/components/ChatContainer";

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
            <div className="container mx-auto px-4 py-8">
                <ChatContainer />
            </div>
        </main>
    );
}
