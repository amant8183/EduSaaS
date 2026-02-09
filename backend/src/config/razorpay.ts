import Razorpay from "razorpay";

// Validate required environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.warn("⚠️  Razorpay credentials not configured. Payment features will not work.");
}

// Initialize Razorpay instance
export const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID || "",
    key_secret: RAZORPAY_KEY_SECRET || "",
});

// Export key for frontend
export const RAZORPAY_KEY = RAZORPAY_KEY_ID;

// Currency configuration
export const CURRENCY = "INR";
