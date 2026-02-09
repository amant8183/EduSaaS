import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: "user" | "admin";
    subscriptionStatus: "active" | "inactive";
    currentSubscriptionId?: mongoose.Types.ObjectId;
    purchasedPortals: string[]; // ["admin", "teacher", "student"]
    enabledFeatures: string[]; // ["fee_management", "gradebook", etc.]
    refreshTokens: string[]; // Hashed refresh tokens for multi-device support
    emailVerified: boolean;
    verificationToken?: string;
    verificationTokenExpiry?: Date;
    passwordResetToken?: string;
    passwordResetTokenExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        subscriptionStatus: { type: String, enum: ["active", "inactive"], default: "inactive" },
        currentSubscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription" },
        purchasedPortals: [{ type: String }],
        enabledFeatures: [{ type: String }],
        refreshTokens: [{ type: String }], // Array of hashed refresh tokens
        emailVerified: { type: Boolean, default: false },
        verificationToken: { type: String },
        verificationTokenExpiry: { type: Date },
        passwordResetToken: { type: String },
        passwordResetTokenExpiry: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
