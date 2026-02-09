import mongoose, { Schema, Document } from "mongoose";
import { VALID_PORTALS } from "../config/pricing";

export interface IOrder extends Document {
    orderId: string;
    razorpayOrderId?: string;
    userId: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    selectedPortals: string[];
    selectedFeatures: string[];
    billingCycle: "monthly" | "annual";
    status: "created" | "paid" | "failed" | "expired";
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
    {
        orderId: { type: String, required: true, unique: true },
        razorpayOrderId: { type: String, index: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        amount: { type: Number, required: true, min: 0 },
        currency: { type: String, default: "INR" },
        selectedPortals: [{ type: String, enum: VALID_PORTALS }],
        selectedFeatures: [{ type: String }],
        billingCycle: { type: String, enum: ["monthly", "annual"], default: "monthly" },
        status: { type: String, enum: ["created", "paid", "failed", "expired"], default: "created", index: true },
        expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 60 * 1000) }, // 30 min expiry
    },
    { timestamps: true }
);

// Compound index for user order history
OrderSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IOrder>("Order", OrderSchema);
