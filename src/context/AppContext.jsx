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
  const [instructor, setInstructor] = useState(null);
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

  //#region Fetch Instructor
  const fetchInstructor = async () => {
    try {
      const { data } = await axios.get(
        "/api/v1/instructor/instructor-authenticated",
      );
      if (data.success) {
        setInstructor(data.instructor);
      }
    } catch (error) {
      toast({
        title: error.message,
      });
      // toast.error(error.message);
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

  //#region Handle Instructor Logout
  const handleLogoutInstructor = async () => {
    try {
      const { data } = await axios.get("/api/v1/instructor/signout");

      if (data.success) {
        if (user?.authProvider === "google") {
          // clears the Google OAuth session and above becuase if we have a success we clear the cookies aswell
          googleLogout();
        }

        navigate("/");
        setInstructor(null);
        setCartItems([]);
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
  // const fetchCourses = async () => {
  //   if (!user || !instructor) return;
  //   try {
  //     const { data } = await axios.get("/api/v1/course/courses");
  //     if (data.success) {
  //       setCourses(data.courses);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching courses:", error);
  //   }
  // };
  const fetchInstructorsCourses = async () => {
    try {
      const { data } = await axios.get("/api/v1/instructor/courses");

      if (data.success) {
        console.log(data.courses);
        setCourses(data.courses);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
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

  const [courseById, setCourseById] = useState({});

  //#region Fetch Course By Id
  const fetchCourseById = async (id) => {
    const { data } = await axios.get(`/api/v1/course/c/${id}`);
    if (data.success) {
      setCourseById(data.course);
      console.log(data.course);
    } else {
      console.log(data.message);
    }
  };

  //#endregion

  useEffect(() => {
    fetchUser();
    fetchInstructor();
    // fetchCourses();
    fetchInstructorsCourses();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    instructor,
    setInstructor,
    axios,
    fetchUser,
    responseMessage,
    handleLogout,
    handleLogoutInstructor,
    courses,
    // fetchCourses,
    fetchInstructorsCourses,
    fetchEnrolledCourses,
    studentCourses,
    coursesProgress,
    fetchCourseById,
    courseById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
