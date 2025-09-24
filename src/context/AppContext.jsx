import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { googleLogout } from "@react-oauth/google";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);
  const [coursesProgress, setCoursesProgress] = useState([]);

  //#region Register Account With Google
  const responseMessage = async (response) => {
    try {
      // response.credential is a JWT from Google
      const { data } = await axios.post("/api/v1/users/google-login", {
        credential: response.credential,
      });

      if (data.success) {
        console.log(data);
        setUser(data.user);
        toast.success("Logged in with Google");
        // setShowUserLogin(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };
  //#endregion

  //#region Fetch User
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/v1/users/user-authenticated");
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      toast.error(error.message);
      setUser(null);
    }
  };
  //#endregion

  //#region Handle User Logout
  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/api/v1/users/signout");
      console.log("Clicked Logout button");

      if (data.success) {
        if (user?.authProvider === "google") {
          // clears the Google OAuth session and above becuase if we have a success we clear the cookies aswell
          googleLogout();
        }

        setUser(null);
        setDraftOrder(null);
        setCartItems([]);
        navigate("/");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  //#endregion

  //#region Get Logged in admin/instructor courses
  const fetchCourses = async () => {
    try {
      const { data } = await axios.get("/api/v1/course/courses");
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  //#endregion

  //#region Get Logged In students enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      const { data } = await axios.get("/api/v1/users/enrolled-courses");
      if (data.success) {
        setStudentCourses(data.enrolledCourses);
        setCoursesProgress(data.coursesProgress);
        // console.log("Student Courses: ", data.enrolledCourses);
        console.log("Courses Progress: ", data.coursesProgress);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  //#endregion

  useEffect(() => {
    fetchUser();
    fetchCourses();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    axios,
    fetchUser,
    responseMessage,
    handleLogout,
    courses,
    fetchCourses,
    fetchEnrolledCourses,
    studentCourses,
    coursesProgress,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
