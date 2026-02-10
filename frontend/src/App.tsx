import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// ===== Placeholder page — replaced in later phases =====
function Placeholder({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">{title}</h1>
        <p className="text-text-secondary text-sm">Coming soon...</p>
      </div>
    </div>
  );
}

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
                <Route path="/" element={<Placeholder title="Home" />} />
                <Route path="/pricing" element={<Placeholder title="Pricing" />} />
                <Route path="/login" element={<Placeholder title="Login" />} />
                <Route path="/register" element={<Placeholder title="Register" />} />
                <Route path="/verify-email" element={<Placeholder title="Verify Email" />} />
                <Route path="/forgot-password" element={<Placeholder title="Forgot Password" />} />
                <Route path="/reset-password" element={<Placeholder title="Reset Password" />} />

                {/* Protected — User */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Placeholder title="Dashboard" />
                    </ProtectedRoute>
                  }
                />

                {/* Protected — Admin */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <Placeholder title="Admin Dashboard" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute adminOnly>
                      <Placeholder title="Admin Users" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/payments"
                  element={
                    <ProtectedRoute adminOnly>
                      <Placeholder title="Admin Payments" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/subscriptions"
                  element={
                    <ProtectedRoute adminOnly>
                      <Placeholder title="Admin Subscriptions" />
                    </ProtectedRoute>
                  }
                />

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
