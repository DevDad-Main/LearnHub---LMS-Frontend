import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  thumbnail: string;
  sections: Section[];
}

interface Section {
  _id: string;
  title: string;
  description: string;
  lectures: Lecture[];
}

interface Lecture {
  _id: string;
  title: string;
  type: "video" | "text";
  content: string;
}

interface CourseGridProps {
  courses?: Course[];
}

const CourseGrid = ({ courses = [] }: CourseGridProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const navigate = useNavigate();

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
              Published ({courses.filter((c) => c.isPublished).length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Draft ({courses.filter((c) => c._id.includes("draft")).length})
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
                    key={course._id}
                    course={course}
                    viewMode={viewMode}
                    onEdit={() => navigate(`/instructor/course/${course._id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No courses found matching your criteria
                  </p>
                  <Button onClick={() => navigate("/instructor/course/create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Course
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="published" className="mt-0">
            {filteredCourses.filter((c) => c.isPublished).length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "flex flex-col space-y-4"
                }
              >
                {filteredCourses
                  .filter((c) => c.isPublished)
                  .map((course) => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      viewMode={viewMode}
                      onEdit={() =>
                        navigate(`/instructor/course/${course._id}`)
                      }
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No published courses found
                  </p>
                  <Button onClick={() => navigate("/instructor/course/create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="draft" className="mt-0">
            {filteredCourses.filter((c) => c._id.includes("draft")).length >
            0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "flex flex-col space-y-4"
                }
              >
                {filteredCourses
                  .filter((c) => c._id.includes("draft"))
                  .map((course) => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      viewMode={viewMode}
                      onEdit={() =>
                        navigate(`/instructor/course/${course._id}`)
                      }
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No draft courses found
                  </p>
                  <Button onClick={() => navigate("/instructor/course/create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
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

export default CourseGrid;
