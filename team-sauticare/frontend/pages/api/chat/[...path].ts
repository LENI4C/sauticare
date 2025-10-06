import { NextApiRequest, NextApiResponse } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { path } = req.query;
    const pathString = Array.isArray(path) ? path.join("/") : path || "";

    // Construct the backend URL
    const backendUrl = `${BACKEND_URL}/api/chat/${pathString}`;

    try {
        const response = await fetch(backendUrl, {
            method: req.method,
            headers: {
                "Content-Type": "application/json",
                ...req.headers,
            },
            body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
        });

        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error) {
        console.error("API proxy error:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}
