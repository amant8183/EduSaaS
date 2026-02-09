import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
    paymentId: string;
    orderId: string;
    userId: mongoose.Types.ObjectId;
    subscriptionId?: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    status: "success" | "failed" | "pending";
    method?: string;
    razorpaySignature?: string;
    createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
    {
        paymentId: { type: String, required: true, unique: true },
        orderId: { type: String, required: true, index: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription" },
        amount: { type: Number, required: true, min: 0 },
        currency: { type: String, default: "INR" },
        status: { type: String, enum: ["success", "failed", "pending"], required: true, index: true },
        method: { type: String },
        razorpaySignature: { type: String },
    },
    { timestamps: true }
);

// Compound index for user payment history
PaymentSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IPayment>("Payment", PaymentSchema);
