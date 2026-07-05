/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────────
 * Sets up the router and wraps the tree in <AuthProvider> (now backed by
 * localStorage, not a real backend — see hooks/useAuth.jsx). Private routes
 * are guarded by <ProtectedRoute>; the admin route additionally
 * requires the admin role.
 */
import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Assessment from "./pages/Assessment";
import Result from "./pages/Result";
import Demo from "./pages/Demo";
import About from "./pages/About";
import HealthPolicy from "./pages/HealthPolicy";

// Dashboard and AdminDashboard both pull in `recharts` (~180kB). They're
// only needed after login, so they're code-split with React.lazy — this
// keeps the public /, /demo, and /login routes (what judges load first)
// fast, especially on a slow connection.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner label="Loading…" />
    </div>
  );
}

function withSuspense(element) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/health-policy", element: <HealthPolicy /> },
  { path: "/demo", element: <Demo /> }, // public, no login required
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/assessment",
    element: (
      <ProtectedRoute>
        <Assessment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/assessment-result",
    element: (
      <ProtectedRoute>
        <Result />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute>{withSuspense(<Dashboard />)}</ProtectedRoute>,
  },
  {
    path: "/admin",
    element: <ProtectedRoute adminOnly>{withSuspense(<AdminDashboard />)}</ProtectedRoute>,
  },
  // Fallback: anything unknown goes home.
  { path: "*", element: <Home /> },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
