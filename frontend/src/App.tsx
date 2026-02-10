import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PricingPage from "./pages/PricingPage";
import DashboardPage from "./pages/DashboardPage";
import AdminLayout from "./components/layout/AdminLayout";
import PageTransition from "./components/layout/PageTransition";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminPayments from "./pages/admin/AdminPayments";
import LandingPage from "./pages/LandingPage";



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-bg-base">
            <Navbar />

            <main>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
                <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
                <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
                <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Protected — User */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <DashboardPage />
                      </PageTransition>
                    </ProtectedRoute>
                  }
                />

                {/* Protected — Admin (nested) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <PageTransition>
                        <AdminLayout />
                      </PageTransition>
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="subscriptions" element={<AdminSubscriptions />} />
                  <Route path="payments" element={<AdminPayments />} />
                </Route>

                {/* 404 */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-[60vh] flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-text-tertiary mb-2">
                          404
                        </h1>
                        <p className="text-text-secondary">Page not found</p>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
