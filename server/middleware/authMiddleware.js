import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

// Middleware to protect routes
export const requireAuth = ClerkExpressRequireAuth({
    onError: (err, req, res) => {
        console.error("Auth error:", err);
        res.status(401).json({
            error: "Unauthorized"
        });
    }
})