import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "SautiCare - Mental Health Support Chatbot",
    description:
        "A compassionate AI chatbot providing mental health support and resources",
    keywords: ["mental health", "chatbot", "support", "wellness", "therapy"],
    authors: [{ name: "SautiCare Team" }],
    viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}
