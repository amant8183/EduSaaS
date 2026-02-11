import nodemailer from "nodemailer";

// Configure Brevo SMTP transport
const smtpPort = parseInt(process.env.BREVO_SMTP_PORT || "587");
const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
    },
});

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@saasplatform.com";
const APP_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export const sendVerificationEmail = async (to: string, name: string, token: string) => {
    const verificationUrl = `${APP_URL}/auth/verify?token=${token}`;

    console.log(`Sending verification email to ${to} from ${FROM_EMAIL}`);

    await transporter.sendMail({
        from: FROM_EMAIL,
        to,
        subject: "Verify your SaaS Platform account",
        html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                <h2>Welcome to SaaS Platform, ${name}!</h2>
                <p>Please verify your email address by clicking the button below:</p>
                <a href="${verificationUrl}" 
                   style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                    Verify Email
                </a>
                <p style="color: #666; font-size: 14px;">
                    Or copy this link: ${verificationUrl}
                </p>
                <p style="color: #666; font-size: 14px;">
                    This link expires in 24 hours.
                </p>
            </div>
        `,
    });
};

export const sendPasswordResetEmail = async (to: string, name: string, token: string) => {
    const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;

    console.log(`Sending password reset email to ${to} from ${FROM_EMAIL}`);

    await transporter.sendMail({
        from: FROM_EMAIL,
        to,
        subject: "Reset your SaaS Platform password",
        html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>Hi ${name},</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <a href="${resetUrl}" 
                   style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                    Reset Password
                </a>
                <p style="color: #666; font-size: 14px;">
                    Or copy this link: ${resetUrl}
                </p>
                <p style="color: #666; font-size: 14px;">
                    This link expires in 1 hour. If you didn't request this, ignore this email.
                </p>
            </div>
        `,
    });
};

export const sendPaymentConfirmation = async (to: string, name: string, amount: number, portals: string[]) => {
    console.log(`Sending payment confirmation to ${to}`);

    await transporter.sendMail({
        from: FROM_EMAIL,
        to,
        subject: "Payment Successful - SaaS Platform",
        html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                <h2>Payment Successful!</h2>
                <p>Hi ${name},</p>
                <p>Your payment of ₹${amount} has been successfully processed.</p>
                <p><strong>Purchased Portals:</strong></p>
                <ul>
                    ${portals.map(portal => `<li>${portal.charAt(0).toUpperCase() + portal.slice(1)} Portal</li>`).join("")}
                </ul>
                <p>You can now access your dashboard to manage your subscription.</p>
                <a href="${APP_URL}/dashboard" 
                   style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                    Go to Dashboard
                </a>
                <p style="color: #666; font-size: 14px;">
                    Thank you for choosing our platform!
                </p>
            </div>
        `,
    });
};
