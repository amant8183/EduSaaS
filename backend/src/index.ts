import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/database";
import authRoutes from "./routes/authRoutes";
import pricingRoutes from "./routes/pricingRoutes";
import paymentRoutes from "./routes/paymentRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for production deployments
app.set("trust proxy", 1);

// Middleware
app.use(cors());
app.use(express.json({ limit: "10kb" })); // Limit payload size

// Health check route
app.get("/", (_req, res) => {
    res.json({
        message: "SaaS Platform Backend API",
        status: "running",
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/payment", paymentRoutes);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Internal server error" });
});

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
