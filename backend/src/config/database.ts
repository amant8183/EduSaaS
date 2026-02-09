import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
        console.error("❌ MONGO_URI is not defined in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};
