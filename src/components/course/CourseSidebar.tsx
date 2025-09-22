import React, { useState } from "react";
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
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isActive?: boolean;
}

interface Section {
  id: string;
  title: string;
  lectures: Lecture[];
}

interface CourseSidebarProps {
  courseName?: string;
  sections?: Section[];
  currentLectureId?: string;
  onLectureSelect?: (lectureId: string) => void;
  onLectureComplete?: (lectureId: string, isCompleted: boolean) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const CourseSidebar = ({
  courseName = "Complete React Developer in 2024",
  sections = defaultSections,
  currentLectureId = "lecture-1-1",
  onLectureSelect = () => {},
  onLectureComplete = () => {},
  isOpen = true,
  onToggle = () => {},
}: CourseSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [lectureStates, setLectureStates] = useState<Record<string, boolean>>(
    () => {
      // Initialize with default completion states
      const initialStates: Record<string, boolean> = {};
      sections.forEach((section) => {
        section.lectures.forEach((lecture) => {
          initialStates[lecture.id] = lecture.isCompleted;
        });
      });
      return initialStates;
    },
  );

  // Find the section containing the current lecture and expand it by default
  React.useEffect(() => {
    if (currentLectureId) {
      const sectionId = sections.find((section) =>
        section.lectures.some((lecture) => lecture.id === currentLectureId),
      )?.id;

      if (sectionId && !expandedSections.includes(sectionId)) {
        setExpandedSections((prev) => [...prev, sectionId]);
      }
    }
  }, [currentLectureId, sections, expandedSections]);

  const handleLectureCompletion = (lectureId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent lecture selection when clicking completion button
    const newCompletionState = !lectureStates[lectureId];
    setLectureStates((prev) => ({
      ...prev,
      [lectureId]: newCompletionState,
    }));
    onLectureComplete(lectureId, newCompletionState);
  };

  // Calculate progress using current lecture states
  const totalLectures = sections.reduce(
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
            <h2 className="text-xl font-semibold">{courseName}</h2>
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
                {sections.map((section, index) => (
                  <AccordionItem
                    key={section.id}
                    value={section.id}
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
                            lectureStates[lecture.id] || false;
                          return (
                            <div
                              key={lecture.id}
                              className={cn(
                                "flex items-center py-3 px-4 text-sm rounded-md gap-3 group cursor-pointer",
                                lecture.id === currentLectureId
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : "hover:bg-muted/50",
                              )}
                            >
                              <div
                                onClick={() => onLectureSelect(lecture.id)}
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
                                  handleLectureCompletion(lecture.id, e)
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

// Default mock data
const defaultSections: Section[] = [
  {
    id: "section-1",
    title: "Getting Started",
    lectures: [
      {
        id: "lecture-1-1",
        title: "Course Introduction",
        duration: "5:32",
        isCompleted: true,
      },
      {
        id: "lecture-1-2",
        title: "Setting Up Your Environment",
        duration: "8:45",
        isCompleted: true,
      },
      {
        id: "lecture-1-3",
        title: "React Basics Overview",
        duration: "12:20",
        isCompleted: false,
      },
    ],
  },
  {
    id: "section-2",
    title: "React Fundamentals",
    lectures: [
      {
        id: "lecture-2-1",
        title: "Components and Props",
        duration: "15:10",
        isCompleted: false,
      },
      {
        id: "lecture-2-2",
        title: "State and Lifecycle",
        duration: "18:35",
        isCompleted: false,
      },
      {
        id: "lecture-2-3",
        title: "Handling Events",
        duration: "10:15",
        isCompleted: false,
      },
      {
        id: "lecture-2-4",
        title: "Conditional Rendering",
        duration: "9:45",
        isCompleted: false,
      },
    ],
  },
  {
    id: "section-3",
    title: "Hooks in Depth",
    lectures: [
      {
        id: "lecture-3-1",
        title: "Introduction to Hooks",
        duration: "14:30",
        isCompleted: false,
      },
      {
        id: "lecture-3-2",
        title: "useState Hook",
        duration: "16:20",
        isCompleted: false,
      },
      {
        id: "lecture-3-3",
        title: "useEffect Hook",
        duration: "20:15",
        isCompleted: false,
      },
      {
        id: "lecture-3-4",
        title: "useContext Hook",
        duration: "18:40",
        isCompleted: false,
      },
      {
        id: "lecture-3-5",
        title: "useReducer Hook",
        duration: "22:10",
        isCompleted: false,
      },
    ],
  },
  {
    id: "section-4",
    title: "Building a Real Project",
    lectures: [
      {
        id: "lecture-4-1",
        title: "Project Setup",
        duration: "10:25",
        isCompleted: false,
      },
      {
        id: "lecture-4-2",
        title: "Component Structure",
        duration: "15:50",
        isCompleted: false,
      },
      {
        id: "lecture-4-3",
        title: "Implementing Features",
        duration: "25:30",
        isCompleted: false,
      },
      {
        id: "lecture-4-4",
        title: "Styling with CSS",
        duration: "18:15",
        isCompleted: false,
      },
      {
        id: "lecture-4-5",
        title: "Deployment",
        duration: "12:40",
        isCompleted: false,
      },
    ],
  },
];

export default CourseSidebar;
