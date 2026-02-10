import api from "./api";
import type {
    AuthResponse,
    RegisterPayload,
    LoginPayload,
    User,
} from "../types";

export const authService = {
    async register(payload: RegisterPayload): Promise<{ message: string }> {
        const { data } = await api.post("/auth/register", payload);
        return data;
    },

    async login(payload: LoginPayload): Promise<AuthResponse> {
        const { data } = await api.post("/auth/login", payload);
        return data;
    },

    async verifyEmail(token: string): Promise<{ message: string }> {
        const { data } = await api.get(`/auth/verify-email?token=${token}`);
        return data;
    },

    async resendVerification(email: string): Promise<{ message: string }> {
        const { data } = await api.post("/auth/resend-verification", { email });
        return data;
    },

    async forgotPassword(email: string): Promise<{ message: string }> {
        const { data } = await api.post("/auth/forgot-password", { email });
        return data;
    },

    async resetPassword(
        token: string,
        password: string
    ): Promise<{ message: string }> {
        const { data } = await api.post("/auth/reset-password", {
            token,
            password,
        });
        return data;
    },

    async refreshToken(
        refreshToken: string
    ): Promise<{ accessToken: string; refreshToken?: string }> {
        const { data } = await api.post("/auth/refresh", { refreshToken });
        return data;
    },

    async logout(refreshToken: string): Promise<void> {
        await api.post("/auth/logout", { refreshToken });
    },

    async getMe(): Promise<{ user: User }> {
        const { data } = await api.get("/auth/me");
        return data;
    },
};
