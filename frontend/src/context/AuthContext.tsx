import {
    createContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import type { User, LoginPayload, RegisterPayload } from "../types";
import { authService } from "../services/authService";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<string>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Validate existing token on mount
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setLoading(false);
            return;
        }

        authService
            .getMe()
            .then(({ user }) => setUser(user))
            .catch(() => {
                // Don't clear tokens here — the api interceptor
                // handles 401 → refresh → clear on failure automatically.
            })
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (payload: LoginPayload) => {
        const response = await authService.login(payload);
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        setUser(response.user);
    }, []);

    const register = useCallback(async (payload: RegisterPayload) => {
        const response = await authService.register(payload);
        return response.message;
    }, []);

    const logout = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) await authService.logout(refreshToken);
        } catch {
            // Silent fail — clear local state regardless
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setUser(null);
        }
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const { user } = await authService.getMe();
            setUser(user);
        } catch {
            // Silent — keep existing user state
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isAdmin: user?.role === "admin",
                loading,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext };
