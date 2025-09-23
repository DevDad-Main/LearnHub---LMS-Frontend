import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext"; // Removed .jsx extension
import { useToast } from "@/components/ui/use-toast";
import VideoPlayer from "@/components/course/VideoPlayer";
import CourseSidebar from "@/components/course/CourseSidebar";
import CourseContentTabs from "@/components/course/CourseContentTabs";
import { Button } from "@/components/ui/button";
import { Menu, X, Loader2 } from "lucide-react";

interface Lecture {
  _id: string;
  title: string;
  type: "Video" | "Text";
  content: string;
  video: string;
  duration: number;
}

interface Section {
  _id: string;
  title: string;
  lectures: Lecture[];
}

interface Instructor {
  _id: string;
  name: string;
  bio: string;
  email: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  thumbnail: string;
  instructor: Instructor;
  sections: Section[];
  totalDuration: number;
}

function CourseVideoPlayerPage() {
  const { axios } = useAppContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLectureId, setCurrentLectureId] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true); // Changed to true initially
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useParams:", { id }); // Debug: Log the id
    console.log("axios:", axios); // Debug: Log axios instance

    if (!id) {
      setError("No course ID provided");
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No course ID provided",
      });
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true); // Ensure loading is true during fetch
        console.log("Fetching course for ID:", id); // Debug
        const response = await axios.get(`/api/v1/course/c/${id}`);
        console.log("API response:", response); // Debug
        const courseData = response.data.course;
        if (!courseData) {
          throw new Error("No course data found");
        }
        setCourse(courseData);
        // Set the first lecture of the first section as default, if available
        if (courseData.sections?.[0]?.lectures?.[0]?._id) {
          setCurrentLectureId(courseData.sections[0].lectures[0]._id);
        }
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching course:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to load course data";
        setError(errorMessage);
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      }
    };

    fetchCourse();
  }, [id, axios, toast]);

  const handleLectureSelect = (lectureId: string) => {
    setCurrentLectureId(lectureId);
    console.log("Selected lecture:", lectureId);
  };

  const handleLectureComplete = async (
    lectureId: string,
    isCompleted: boolean,
  ) => {
    console.log(
      `Lecture ${lectureId} marked as ${isCompleted ? "completed" : "incomplete"}`,
    );
    try {
      await axios.post(`/api/v1/course/${id}/lecture/${lectureId}/complete`, {
        isCompleted,
      });
      toast({
        title: "Success",
        description: `Lecture marked as ${isCompleted ? "completed" : "incomplete"}`,
      });
    } catch (err: any) {
      console.error("Error updating lecture completion:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err.response?.data?.message || "Failed to update lecture completion",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md max-w-6xl mx-auto">
          {error || "Failed to load course data"}
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mt-4 max-w-6xl mx-auto block"
        >
          ← Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div
        className={`
          ${sidebarOpen ? "w-96" : "w-0"}
          transition-all duration-300 overflow-hidden border-r flex-shrink-0
        `}
      >
        <CourseSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentLectureId={currentLectureId}
          onLectureSelect={handleLectureSelect}
          onLectureComplete={handleLectureComplete}
          course={course}
        />
      </div>

      {/* Sidebar toggle button (always visible now) */}
      <div className="p-4 border-b bg-background">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-col flex-1">
        {/* Video player section */}
        <div
          onClick={() => window.scrollTo(0, 0)}
          className="bg-black flex items-center justify-center h-[70vh] mr-14"
        >
          <VideoPlayer
            lecture={course.sections
              .flatMap((section) => section.lectures)
              .find((lecture) => lecture._id === currentLectureId)}
          />
        </div>

        {/* Content tabs section */}
        <div className="bg-background border-t">
          <div className="max-w-6xl mx-auto p-6">
            <CourseContentTabs course={course} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseVideoPlayerPage;
