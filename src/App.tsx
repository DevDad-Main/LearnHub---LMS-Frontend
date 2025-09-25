import { Suspense, useEffect, useState } from "react";
import { useRoutes, Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./components/home";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Dashboard from "./pages/dashboard";
import CourseDetails from "./pages/course/course-details";
import Cart from "./pages/cart";
import routes from "tempo-routes";
import { useAppContext } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CourseVideoPlayerPage from "./components/course/CourseVideoPlayerPage";
import CourseForm from "./components/admin/CourseForm.js";
import AdminDashboard from "./components/admin/AdminDashboard.js";

function App() {
  const location = useLocation();
  const { axios, navigate } = useAppContext();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/v1/users/user-authenticated");
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        // toast.error(error.message);
        setUser(null);
      } finally {
        setIsLoading(false); // Set loading to false after auth check
      }
    };
    fetchUser();
  }, []);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        {/* Auth pages (no MainLayout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Everything else inside MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute user={user}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/learn/:id"
            element={
              <ProtectedRoute user={user}>
                <CourseVideoPlayerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/add-course"
            element={
              <ProtectedRoute user={user}>
                <CourseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/courses" element={<AdminDashboard />} />
          <Route path="/admin/course/create" element={<CourseForm />} />
          <Route path="/admin/course/:courseId" element={<CourseForm />} />
        </Route>
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </Suspense>
  );
}

export default App;
