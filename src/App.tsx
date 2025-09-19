import { Suspense } from "react";
import { useRoutes, Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Home from "./components/home";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Dashboard from "./pages/dashboard";
import CourseDetails from "./pages/course/course-details";
import Cart from "./pages/cart";
import routes from "tempo-routes";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {isAuthPage ? (
        <>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      ) : (
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </MainLayout>
      )}
    </Suspense>
  );
}

export default App;