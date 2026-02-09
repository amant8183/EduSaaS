import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/database";

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for production deployments
app.set("trust proxy", 1);

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (_req, res) => {
    res.json({
        message: "SaaS Platform Backend API",
        status: "running",
        timestamp: new Date().toISOString()
    });
});

// API Routes will be mounted here as we build them
// app.use("/api/auth", authRoutes);
// app.use("/api/pricing", pricingRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/admin", adminRoutes);

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});
