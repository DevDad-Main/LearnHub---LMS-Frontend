import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Play,
  Download,
  MessageSquare,
  Clock,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

interface Lecture {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  videoUrl: string;
}

interface Section {
  id: string;
  title: string;
  lectures: Lecture[];
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  sections: Section[];
  totalLectures: number;
  completedLectures: number;
}

export default function CoursePlayer() {
  const { courseId } = useParams<{ courseId: string }>();
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock data - in a real app this would come from an API
  const course: Course = {
    id: courseId || "default-course",
    title: "Complete Web Development Bootcamp",
    instructor: "Jane Smith",
    description:
      "Learn web development from scratch with this comprehensive bootcamp covering HTML, CSS, JavaScript, React, Node.js and more.",
    sections: [
      {
        id: "section-1",
        title: "Introduction to Web Development",
        lectures: [
          {
            id: "lecture-1-1",
            title: "Welcome to the Course",
            duration: "5:20",
            isCompleted: true,
            videoUrl: "https://example.com/video1",
          },
          {
            id: "lecture-1-2",
            title: "How the Web Works",
            duration: "12:45",
            isCompleted: true,
            videoUrl: "https://example.com/video2",
          },
          {
            id: "lecture-1-3",
            title: "Setting Up Your Development Environment",
            duration: "18:30",
            isCompleted: false,
            videoUrl: "https://example.com/video3",
          },
        ],
      },
      {
        id: "section-2",
        title: "HTML Fundamentals",
        lectures: [
          {
            id: "lecture-2-1",
            title: "HTML Document Structure",
            duration: "14:10",
            isCompleted: false,
            videoUrl: "https://example.com/video4",
          },
          {
            id: "lecture-2-2",
            title: "HTML Elements and Attributes",
            duration: "22:35",
            isCompleted: false,
            videoUrl: "https://example.com/video5",
          },
          {
            id: "lecture-2-3",
            title: "Forms and Input Elements",
            duration: "19:15",
            isCompleted: false,
            videoUrl: "https://example.com/video6",
          },
        ],
      },
      {
        id: "section-3",
        title: "CSS Styling",
        lectures: [
          {
            id: "lecture-3-1",
            title: "CSS Selectors",
            duration: "16:40",
            isCompleted: false,
            videoUrl: "https://example.com/video7",
          },
          {
            id: "lecture-3-2",
            title: "Box Model and Layout",
            duration: "24:15",
            isCompleted: false,
            videoUrl: "https://example.com/video8",
          },
          {
            id: "lecture-3-3",
            title: "Responsive Design",
            duration: "28:50",
            isCompleted: false,
            videoUrl: "https://example.com/video9",
          },
        ],
      },
    ],
    totalLectures: 9,
    completedLectures: 2,
  };

  // Set initial lecture if not set
  React.useEffect(() => {
    if (
      !currentLecture &&
      course.sections.length > 0 &&
      course.sections[0].lectures.length > 0
    ) {
      setCurrentLecture(course.sections[0].lectures[0]);
    }
  }, [currentLecture, course]);

  const handleLectureSelect = (lecture: Lecture) => {
    setCurrentLecture(lecture);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const markLectureComplete = (lectureId: string) => {
    // In a real app, this would make an API call to update the completion status
    console.log(`Marking lecture ${lectureId} as complete`);
  };

  const progressPercentage =
    (course.completedLectures / course.totalLectures) * 100;

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Course Player Section */}
      <div
        className={`bg-black ${isFullscreen ? "fixed inset-0 z-50" : "relative w-full"}`}
      >
        <div className="container mx-auto">
          <div className="aspect-video relative">
            {currentLecture ? (
              <div className="w-full h-full flex items-center justify-center">
                {/* Video player would be here - using placeholder */}
                <div className="bg-gray-800 w-full h-full flex items-center justify-center">
                  <Play className="h-16 w-16 text-white opacity-50" />
                  <span className="sr-only">Play video</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <p className="text-white">Select a lecture to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Content Section */}
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Column - Video Info and Tabs */}
        <div className="lg:w-2/3">
          {/* Video Title and Controls */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              {currentLecture?.title || "Select a lecture"}
            </h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  currentLecture && markLectureComplete(currentLecture.id)
                }
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Complete
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Resources
              </Button>
            </div>
          </div>

          {/* Tabs for Content, Q&A, Notes */}
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="qa">Q&A</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="space-y-4">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold">About this lecture</h2>
                <p>
                  {currentLecture
                    ? "This lecture covers the fundamentals needed to understand the topic. Watch the video and download the attached resources to get the most out of this lesson."
                    : "Select a lecture to view its content."}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="qa">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Questions & Answers</h2>
                  <Button>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Ask a Question
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">
                      No questions yet for this lecture.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="notes">
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Your Notes</h2>
                <textarea
                  className="w-full h-40 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add your notes here..."
                />
                <Button className="self-end">Save Notes</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Course Navigation */}
        <div className="lg:w-1/3">
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Course Progress</h2>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {course.completedLectures} of {course.totalLectures} lectures
                completed ({Math.round(progressPercentage)}%)
              </p>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Course Content</h2>
              <div className="text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {course.totalLectures} lectures
                </span>
                <span className="flex items-center gap-1 mt-1">
                  <Clock className="h-4 w-4" />
                  3h 20m total length
                </span>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {course.sections.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="text-left">
                      <p className="font-medium">{section.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {section.lectures.length} lectures •
                        {section.lectures.reduce(
                          (acc, lecture) =>
                            acc + parseInt(lecture.duration.split(":")[0]),
                          0,
                        )}{" "}
                        min
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1">
                      {section.lectures.map((lecture) => (
                        <li
                          key={lecture.id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent ${currentLecture?.id === lecture.id ? "bg-accent" : ""}`}
                          onClick={() => handleLectureSelect(lecture)}
                        >
                          <div className="flex items-center gap-2">
                            {lecture.isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                            <span
                              className={
                                lecture.isCompleted ? "text-primary" : ""
                              }
                            >
                              {lecture.title}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {lecture.duration}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
