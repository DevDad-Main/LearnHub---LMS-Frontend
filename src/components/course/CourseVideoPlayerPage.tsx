import VideoPlayer from "@/components/course/VideoPlayer";
import CourseSidebar from "@/components/course/CourseSidebar";
import CourseContentTabs from "@/components/course/CourseContentTabs";
import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";

function CourseVideoPlayerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLectureId, setCurrentLectureId] = useState("lecture-1-3");

  const handleLectureSelect = (lectureId: string) => {
    setCurrentLectureId(lectureId);
    console.log("Selected lecture:", lectureId);
  };

  const handleLectureComplete = (lectureId: string, isCompleted: boolean) => {
    console.log(
      `Lecture ${lectureId} marked as ${isCompleted ? "completed" : "incomplete"}`,
    );
    // Here you would typically update your backend/state management
  };

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
        {/* Video player section - takes up more space */}

        <div
          onClick={() => scrollTo(0, 0)}
          className="bg-black flex items-center justify-center h-[70vh] mr-14"
        >
          <VideoPlayer />
        </div>

        {/* Content tabs section */}
        <div className="bg-background border-t">
          <div className="max-w-6xl mx-auto p-6">
            <CourseContentTabs />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseVideoPlayerPage;
