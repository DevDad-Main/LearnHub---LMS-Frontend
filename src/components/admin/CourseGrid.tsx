import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid, List, Plus, Search } from "lucide-react";
import CourseCard from "./CourseCard";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  thumbnail: string;
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  description: string;
  lectures: Lecture[];
}

interface Lecture {
  id: string;
  title: string;
  type: "video" | "text" | "quiz";
  content: string;
}

interface CourseGridProps {
  courses?: Course[];
  onCreateCourse?: () => void;
  onEditCourse?: (course: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
}

const CourseGrid = ({
  courses = mockCourses,
  onCreateCourse = () => {},
  onEditCourse = () => {},
  onDeleteCourse = () => {},
}: CourseGridProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  // Filter courses based on search query and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Business",
    "Marketing",
    "Design",
    "Photography",
  ];

  const levels = ["beginner", "intermediate", "advanced"];

  return (
    <div className="w-full bg-background p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <Button onClick={onCreateCourse}>
            <Plus className="mr-2 h-4 w-4" /> Create Course
          </Button>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              All Courses ({courses.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              Published ({courses.filter((c) => c.id.includes("pub")).length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Draft ({courses.filter((c) => c.id.includes("draft")).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {filteredCourses.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "flex flex-col space-y-4"
                }
              >
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    viewMode={viewMode}
                    onEdit={() => onEditCourse(course)}
                    onDelete={() => onDeleteCourse(course.id)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No courses found matching your criteria
                  </p>
                  <Button onClick={onCreateCourse}>
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Course
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="published" className="mt-0">
            {filteredCourses.filter((c) => c.id.includes("pub")).length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "flex flex-col space-y-4"
                }
              >
                {filteredCourses
                  .filter((c) => c.id.includes("pub"))
                  .map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      viewMode={viewMode}
                      onEdit={() => onEditCourse(course)}
                      onDelete={() => onDeleteCourse(course.id)}
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No published courses found
                  </p>
                  <Button onClick={onCreateCourse}>
                    <Plus className="mr-2 h-4 w-4" /> Create Course
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="draft" className="mt-0">
            {filteredCourses.filter((c) => c.id.includes("draft")).length >
            0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "flex flex-col space-y-4"
                }
              >
                {filteredCourses
                  .filter((c) => c.id.includes("draft"))
                  .map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      viewMode={viewMode}
                      onEdit={() => onEditCourse(course)}
                      onDelete={() => onDeleteCourse(course.id)}
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No draft courses found
                  </p>
                  <Button onClick={onCreateCourse}>
                    <Plus className="mr-2 h-4 w-4" /> Create Course
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Mock data for development
const mockCourses: Course[] = [
  {
    id: "pub-1",
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js and more!",
    category: "Web Development",
    level: "beginner",
    price: 89.99,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
    sections: [
      {
        id: "section-1",
        title: "Introduction to HTML",
        description: "Learn the basics of HTML",
        lectures: [
          {
            id: "lecture-1",
            title: "HTML Basics",
            type: "video",
            content: "video-url",
          },
          {
            id: "lecture-2",
            title: "HTML Tags",
            type: "text",
            content: "text-content",
          },
        ],
      },
    ],
  },
  {
    id: "pub-2",
    title: "Advanced React Patterns",
    description: "Master advanced React patterns and techniques",
    category: "Web Development",
    level: "advanced",
    price: 129.99,
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
    sections: [
      {
        id: "section-1",
        title: "Component Patterns",
        description: "Learn advanced component patterns",
        lectures: [
          {
            id: "lecture-1",
            title: "Compound Components",
            type: "video",
            content: "video-url",
          },
          {
            id: "lecture-2",
            title: "Render Props",
            type: "video",
            content: "video-url",
          },
        ],
      },
    ],
  },
  {
    id: "draft-1",
    title: "iOS App Development with Swift",
    description: "Build iOS apps from scratch using Swift",
    category: "Mobile Development",
    level: "intermediate",
    price: 99.99,
    thumbnail:
      "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=600&q=80",
    sections: [
      {
        id: "section-1",
        title: "Swift Basics",
        description: "Introduction to Swift programming",
        lectures: [
          {
            id: "lecture-1",
            title: "Variables and Constants",
            type: "video",
            content: "video-url",
          },
          {
            id: "lecture-2",
            title: "Control Flow",
            type: "quiz",
            content: "quiz-content",
          },
        ],
      },
    ],
  },
  {
    id: "pub-3",
    title: "Data Science Fundamentals",
    description: "Learn the basics of data science with Python",
    category: "Data Science",
    level: "beginner",
    price: 79.99,
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    sections: [
      {
        id: "section-1",
        title: "Python for Data Science",
        description: "Learn Python basics for data science",
        lectures: [
          {
            id: "lecture-1",
            title: "NumPy Introduction",
            type: "video",
            content: "video-url",
          },
          {
            id: "lecture-2",
            title: "Pandas Basics",
            type: "text",
            content: "text-content",
          },
        ],
      },
    ],
  },
  {
    id: "draft-2",
    title: "Digital Marketing Masterclass",
    description: "Complete guide to digital marketing strategies",
    category: "Marketing",
    level: "intermediate",
    price: 69.99,
    thumbnail:
      "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=600&q=80",
    sections: [
      {
        id: "section-1",
        title: "Social Media Marketing",
        description: "Learn effective social media strategies",
        lectures: [
          {
            id: "lecture-1",
            title: "Facebook Ads",
            type: "video",
            content: "video-url",
          },
          {
            id: "lecture-2",
            title: "Instagram Marketing",
            type: "video",
            content: "video-url",
          },
        ],
      },
    ],
  },
  {
    id: "pub-4",
    title: "UI/UX Design Principles",
    description: "Master the fundamentals of UI/UX design",
    category: "Design",
    level: "beginner",
    price: 89.99,
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    sections: [
      {
        id: "section-1",
        title: "Design Fundamentals",
        description: "Learn the basics of design",
        lectures: [
          {
            id: "lecture-1",
            title: "Color Theory",
            type: "video",
            content: "video-url",
          },
          {
            id: "lecture-2",
            title: "Typography",
            type: "text",
            content: "text-content",
          },
        ],
      },
    ],
  },
];

export default CourseGrid;
