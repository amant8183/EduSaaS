import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { pricingService } from "../services/pricingService";
import { userService } from "../services/userService";
import { adminService } from "../services/adminService";

/**
 * Prefetch all major queries right after authentication is confirmed.
 * Data lands in the TanStack Query cache so every page renders instantly.
 */
export function usePrefetchQueries() {
    const queryClient = useQueryClient();
    const { user, isAuthenticated, isAdmin } = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        // ── Public / all-users ──
        queryClient.prefetchQuery({
            queryKey: ["pricing"],
            queryFn: () => pricingService.getAll(),
        });

        // ── Authenticated user pages ──
        queryClient.prefetchQuery({
            queryKey: ["user-dashboard"],
            queryFn: () => userService.getDashboard(),
        });

        queryClient.prefetchQuery({
            queryKey: ["user-subscription"],
            queryFn: () => userService.getSubscription(),
        });

        queryClient.prefetchQuery({
            queryKey: ["user-payments", 1],
            queryFn: () => userService.getPaymentHistory(1),
        });

        // ── Admin-only pages ──
        if (isAdmin) {
            queryClient.prefetchQuery({
                queryKey: ["admin-dashboard"],
                queryFn: () => adminService.getDashboard(),
            });

            queryClient.prefetchQuery({
                queryKey: ["admin-users", 1, "", ""],
                queryFn: () => adminService.getUsers(1, 15, "", ""),
            });

            queryClient.prefetchQuery({
                queryKey: ["admin-subscriptions", 1, ""],
                queryFn: () => adminService.getSubscriptions(1, 15, ""),
            });

            queryClient.prefetchQuery({
                queryKey: ["admin-payments", 1, ""],
                queryFn: () => adminService.getPayments(1, 15, ""),
            });

            queryClient.prefetchQuery({
                queryKey: ["admin-pricing"],
                queryFn: () => adminService.getPricing(),
            });
        }
    }, [isAuthenticated, isAdmin, user, queryClient]);
}
