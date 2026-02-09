import mongoose, { Schema, Document } from "mongoose";
import { VALID_PORTALS } from "../config/pricing";

export interface ISubscription extends Document {
    userId: mongoose.Types.ObjectId;
    orderId: string;
    portals: string[];
    features: string[];
    amount: number;
    billingCycle: "monthly" | "annual";
    startDate: Date;
    endDate: Date;
    status: "active" | "inactive" | "cancelled";
    autoRenew: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        orderId: { type: String, required: true },
        portals: [{ type: String, enum: VALID_PORTALS }],
        features: [{ type: String }],
        amount: { type: Number, required: true, min: 0 },
        billingCycle: { type: String, enum: ["monthly", "annual"], default: "monthly" },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { type: String, enum: ["active", "inactive", "cancelled"], default: "active", index: true },
        autoRenew: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Compound index for common queries
SubscriptionSchema.index({ userId: 1, status: 1 });

export default mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
