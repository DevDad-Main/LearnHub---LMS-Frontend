import { Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import ProtectedInstructorRoute from "./components/ProtectedInstructorRoute";
import CourseVideoPlayerPage from "./components/course/CourseVideoPlayerPage";
import CourseForm from "./components/admin/CourseForm.js";
import InstructorDashboard from "./components/admin/InstructorDashboard.tsx";
import InstructorLogin from "./pages/instructor/auth/InstructorLogin.js";
import InstructorRegister from "./pages/instructor/auth/InstructorRegister.js";
import InstructorProfile from "./pages/instructor/InstructorProfile.js";
import { Toaster } from "./components/ui/toaster.tsx";
import AllCourses from "./pages/course/AllCourses.tsx";
import CategoryCourses from "./pages/course/CategoryCourses.tsx";
import Loading from "./components/Loading.jsx";
import InstructorProfilePage from "./pages/instructor/InstructorProfilePage.tsx";

function App() {
  const { instructor, isLoading, user } = useAppContext();

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
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          {/* Auth pages (no MainLayout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Everything else inside MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route
              path="/instructor/:instructorId"
              element={<InstructorProfilePage />}
            />
            <Route path="/courses" element={<AllCourses />} />
            <Route path="/categories/:category" element={<CategoryCourses />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user} isLoading={isLoading}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute user={user} isLoading={isLoading}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/learn/:id"
              element={
                <ProtectedRoute user={user} isLoading={isLoading}>
                  <CourseVideoPlayerPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Instructor routes */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedInstructorRoute
                instructor={instructor}
                isLoading={isLoading}
              >
                <InstructorDashboard />
              </ProtectedInstructorRoute>
            }
          />
          <Route
            path="/instructor/courses"
            element={
              <ProtectedInstructorRoute
                instructor={instructor}
                isLoading={isLoading}
              >
                <InstructorDashboard />
              </ProtectedInstructorRoute>
            }
          />
          <Route
            path="/instructor/course/create"
            element={
              <ProtectedInstructorRoute
                instructor={instructor}
                isLoading={isLoading}
              >
                <CourseForm />
              </ProtectedInstructorRoute>
            }
          />
          <Route
            path="/instructor/course/:courseId"
            element={
              <ProtectedInstructorRoute
                instructor={instructor}
                isLoading={isLoading}
              >
                <CourseForm />
              </ProtectedInstructorRoute>
            }
          />
          <Route
            path="/instructor/profile"
            element={
              <ProtectedInstructorRoute
                instructor={instructor}
                isLoading={isLoading}
              >
                <InstructorProfile />
              </ProtectedInstructorRoute>
            }
          />

          {/* Instructor auth pages */}
          <Route path="/instructor/login" element={<InstructorLogin />} />
          <Route path="/instructor/register" element={<InstructorRegister />} />
        </Routes>

        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
