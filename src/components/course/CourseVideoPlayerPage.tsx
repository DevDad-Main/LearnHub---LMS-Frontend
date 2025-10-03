import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useToast } from "@/components/ui/use-toast";
import VideoPlayer, { VideoPlayerHandle } from "./VideoPlayer";
import CourseSidebar from "./CourseSidebar";
import CourseContentTabs from "./CourseContentTabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu, X, Loader2, Trophy, Star, CheckCircle } from "lucide-react";

interface Lecture {
  _id: string;
  title: string;
  type: "Video" | "Text";
  content: string;
  video: string;
  duration: number;
  isCompleted: boolean;
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
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLectureId, setCurrentLectureId] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [courseProgress, setCourseProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lectureCompletion, setLectureCompletion] = useState<{
    [key: string]: boolean;
  }>({});
  const [showCongratulations, setShowCongratulations] = useState(false);

  // Helper function to find next uncompleted lecture
  // const findNextUncompletedLecture = (
  //   courseData: Course,
  //   completionMap: { [key: string]: boolean },
  // ) => {
  //   for (const section of courseData.sections) {
  //     for (const lecture of section.lectures) {
  //       if (!completionMap[lecture._id]) {
  //         return lecture._id;
  //       }
  //     }
  //   }
  //   return null; // All lectures completed
  // };

  // Check if course is completed
  const isCourseCompleted = (
    courseData: Course,
    completionMap: { [key: string]: boolean },
  ) => {
    const allLectures = courseData.sections.flatMap(
      (section) => section.lectures,
    );
    return allLectures.every((lecture) => completionMap[lecture._id]);
  };

  const findNextUncompletedLecture = (
    courseData: Course,
    completionMap: Record<string, boolean>,
  ) => {
    for (const section of courseData.sections) {
      for (const lecture of section.lectures) {
        if (!completionMap[lecture._id]) {
          return lecture._id;
        }
      }
    }
    return null; // All lectures completed
  };

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/v1/course/learn/c/${id}`);
        const courseData = data.course;
        const completedLectures: string[] = data.completedLectures || []; // <- ensure backend sends this

        if (!courseData) throw new Error("No course data found");
        setCourse(courseData);

        // Setting the courseProgress last accessed field
        await setLastAccessed(id);

        // Map lecture completion
        const completionMap: Record<string, boolean> = {};
        courseData.sections.forEach((section) => {
          section.lectures.forEach((lecture) => {
            completionMap[lecture._id] = completedLectures.includes(
              lecture._id,
            );
          });
        });
        setLectureCompletion(completionMap);

        // Pick next uncompleted lecture
        const nextLecture = findNextUncompletedLecture(
          courseData,
          completionMap,
        );
        if (nextLecture) {
          setCurrentLectureId(nextLecture);
        } else {
          // All completed, pick first lecture and show congratulations
          setCurrentLectureId(courseData.sections[0].lectures[0]._id);
          setShowCongratulations(true);
        }

        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load course");
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: err.response?.data?.message || "Failed to load course",
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
      const { data } = await axios.post(
        `/api/v1/course/${id}/lecture/${lectureId}/toggle-complete`,
        { isCompleted },
      );

      if (!data.success)
        throw new Error(data.message || "Failed to toggle lecture");

      // Update local completion map
      const newCompletionMap = {
        ...lectureCompletion,
        [lectureId]: isCompleted,
      };
      setLectureCompletion(newCompletionMap);

      // Automatically go to next uncompleted lecture
      if (course) {
        const nextLecture = findNextUncompletedLecture(
          course,
          newCompletionMap,
        );
        if (nextLecture) {
          setCurrentLectureId(nextLecture);
        } else {
          // All completed
          setShowCongratulations(true);
        }
      }

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

  const setLastAccessed = async (id) => {
    try {
      const { data } = await axios.post(`/api/v1/course/c/${id}/last-accessed`);

      if (data.success) {
        console.log(data);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Navigation for next/previous lectures
  const allLectures = course
    ? course.sections.flatMap((section) => section.lectures)
    : [];
  const currentLectureIndex = allLectures.findIndex(
    (lecture) => lecture._id === currentLectureId,
  );
  const hasNext = currentLectureIndex < allLectures.length - 1;
  const hasPrevious = currentLectureIndex > 0;

  const onNext = () => {
    if (hasNext) {
      const nextLecture = allLectures[currentLectureIndex + 1];
      setCurrentLectureId(nextLecture._id);
      window.scrollTo(0, 0);
    }
  };

  const onPrevious = () => {
    if (hasPrevious) {
      const prevLecture = allLectures[currentLectureIndex - 1];
      setCurrentLectureId(prevLecture._id);
      window.scrollTo(0, 0);
    }
  };

  // Course completion component
  const CourseCompletionCelebration = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Trophy className="h-16 w-16 text-yellow-500" />
              <div className="absolute -top-2 -right-2">
                <Star className="h-8 w-8 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            🎉 Congratulations! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Course Completed!</span>
          </div>
          <p className="text-muted-foreground">
            You've successfully completed <strong>{course?.title}</strong>!
            Great job on your learning journey.
          </p>
          <div className="space-y-2 pt-4">
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full"
              size="lg"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCongratulations(false)}
              className="w-full"
            >
              Continue Reviewing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
    <>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <div
          className={`
            ${sidebarOpen ? "w-94" : "w-0"}
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
            lectureCompletion={lectureCompletion}
          />
        </div>

        {/* Sidebar toggle button */}
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
              ref={videoPlayerRef}
              lecture={course.sections
                .flatMap((section) => section.lectures)
                .find((lecture) => lecture._id === currentLectureId)}
              onNext={onNext}
              onPrevious={onPrevious}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
            />
          </div>

          {/* Content tabs section */}
          <div className="bg-background border-t">
            <div className="max-w-6xl mx-auto p-6">
              <CourseContentTabs
                course={course}
                getCurrentTime={() =>
                  videoPlayerRef.current?.getCurrentTime() ?? 0
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course completion celebration modal */}
      {showCongratulations && <CourseCompletionCelebration />}
    </>
  );
}

export default CourseVideoPlayerPage;
