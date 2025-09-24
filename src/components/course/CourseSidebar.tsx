import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Play,
  Menu,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface Lecture {
  _id: string;
  title: string;
  type: "Video";
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

interface Course {
  _id: string;
  title: string;
  sections: Section[];
}

interface CourseSidebarProps {
  course: Course;
  currentLectureId?: string | null;
  onLectureSelect: (lectureId: string) => void;
  onLectureComplete: (lectureId: string, isCompleted: boolean) => void;
  isOpen: boolean;
  onToggle: () => void;
  lectureCompletion: { [key: string]: boolean };
}

const CourseSidebar = ({
  course,
  currentLectureId,
  onLectureSelect,
  onLectureComplete,
  isOpen,
  onToggle,
  lectureCompletion,
}: CourseSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [lectureStates, setLectureStates] = useState<Record<string, boolean>>(
    {},
  );

  // Initialize lectureStates from course data and sync with lectureCompletion
  useEffect(() => {
    const initialStates: Record<string, boolean> = {};
    course.sections.forEach((section) => {
      section.lectures.forEach((lecture) => {
        initialStates[lecture._id] =
          lectureCompletion[lecture._id] || lecture.isCompleted || false;
      });
    });
    setLectureStates(initialStates);
  }, [course, lectureCompletion]);

  // Expand the section containing the current lecture ONLY when currentLectureId changes
  useEffect(() => {
    if (currentLectureId) {
      const sectionId = course.sections.find((section) =>
        section.lectures.some((lecture) => lecture._id === currentLectureId),
      )?._id;

      if (sectionId) {
        setExpandedSections((prev) => {
          // Only add if not already expanded to avoid conflicts
          if (!prev.includes(sectionId)) {
            return [...prev, sectionId];
          }
          return prev;
        });
      }
    }
  }, [currentLectureId, course.sections]); // Removed expandedSections from dependencies to prevent infinite loops

  const handleLectureCompletion = (lectureId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newCompletionState = !lectureStates[lectureId];
    setLectureStates((prev) => ({
      ...prev,
      [lectureId]: newCompletionState,
    }));
    onLectureComplete(lectureId, newCompletionState);
  };

  // Calculate progress
  const totalLectures = course.sections.reduce(
    (acc, section) => acc + section.lectures.length,
    0,
  );
  const completedLectures = Object.values(lectureStates).filter(Boolean).length;
  const progressPercentage =
    totalLectures > 0
      ? Math.round((completedLectures / totalLectures) * 100)
      : 0;

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background transition-all duration-300 overflow-hidden",
        isOpen ? "w-full" : "w-0",
      )}
    >
      {isOpen && (
        <>
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="md:hidden"
            >
              {/* <Menu className="h-5 w-5" /> */}
            </Button>
          </div>

          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Your progress</span>
              <span className="text-sm font-medium">
                {progressPercentage}% complete
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              <Accordion
                type="multiple"
                value={expandedSections}
                onValueChange={setExpandedSections}
                className="w-full"
              >
                {course.sections.map((section, index) => (
                  <AccordionItem
                    key={section._id}
                    value={section._id}
                    className="border-b"
                  >
                    <AccordionTrigger className="py-4 px-3 hover:bg-muted/50 rounded-md">
                      <div className="flex items-center text-left">
                        <span className="font-medium mr-2">
                          Section {index + 1}:
                        </span>
                        <span className="text-sm">{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-3 space-y-1">
                        {section.lectures.map((lecture) => {
                          const isCompleted =
                            lectureStates[lecture._id] || false;

                          return (
                            <div
                              key={lecture._id}
                              className={cn(
                                "flex items-center py-3 px-4 text-sm rounded-md gap-3 group cursor-pointer",
                                lecture._id === currentLectureId
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : "hover:bg-muted/50",
                              )}
                            >
                              <div
                                onClick={() => onLectureSelect(lecture._id)}
                                className="flex items-center gap-3 flex-1"
                              >
                                <Play className="h-4 w-4 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="truncate font-medium">
                                    {lecture.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {lecture.duration}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "h-8 w-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity",
                                  isCompleted && "opacity-100",
                                )}
                                onClick={(e) =>
                                  handleLectureCompletion(lecture._id, e)
                                }
                              >
                                {isCompleted ? (
                                  <CheckCircle className="h-5 w-5 text-green-600 fill-green-100" />
                                ) : (
                                  <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                                )}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
};

export default CourseSidebar;
