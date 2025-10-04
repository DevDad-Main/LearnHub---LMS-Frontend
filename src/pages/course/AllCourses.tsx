import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  Users,
  ShoppingCart,
  Eye,
  Loader2,
} from "lucide-react";

interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  level: string;
  price: number;
  thumbnail: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
  sections: any[];
  totalDuration?: number;
  studentsCount?: number;
  rating?: number;
  reviewsCount?: number;
}

const courseCategories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Business",
  "Marketing",
  "Design",
  "Photography",
];

const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

const AllCourses = () => {
  const { axios } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const coursesPerPage = 4;

  // Filters
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "",
  );
  const [levelFilter, setLevelFilter] = useState(
    searchParams.get("level") || "",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: coursesPerPage.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(levelFilter && { level: levelFilter }),
        ...(sortBy && { sort: sortBy }),
      });

      const response = await axios.get(`/api/v1/course/all?${params}`);
      const data = response.data;

      setCourses(data.courses || []);
      setTotalPages(data.totalPages || 1);
      setTotalCourses(data.totalCourses || 0);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError(err.response?.data?.message || "Failed to load courses");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load courses",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchQuery, categoryFilter, levelFilter, sortBy]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (categoryFilter) params.set("category", categoryFilter);
    if (levelFilter) params.set("level", levelFilter);
    if (sortBy !== "newest") params.set("sort", sortBy);
    setSearchParams(params);
  }, [searchQuery, categoryFilter, levelFilter, sortBy, setSearchParams]);

  const handleAddToCart = async (courseId: string) => {
    try {
      const { data } = await axios.post(`/api/v1/users/cart/add`, { courseId });
      if (data.success) {
        toast({
          title: "Success",
          description: "Course added to cart!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.response?.data?.message || "Failed to load course",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to add to cart",
      });
    }
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const CourseCard = ({
    course,
    viewMode,
  }: {
    course: Course;
    viewMode: "grid" | "list";
  }) => (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 ${viewMode === "list" ? "flex flex-row" : ""}`}
    >
      <div
        className={`relative overflow-hidden ${viewMode === "list" ? "w-64 flex-shrink-0" : ""}`}
      >
        <img
          src={
            course.thumbnail ||
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80"
          }
          alt={course.title}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            viewMode === "list" ? "h-full" : "h-48"
          }`}
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90 text-black">
            {course.level}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary text-primary-foreground">
            ${course.price}
          </Badge>
        </div>
      </div>

      <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
        <CardHeader className="p-0 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </CardTitle>
              {course.subtitle && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {course.subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {course.studentsCount || 0} students
            </div>
            {course.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                {course.rating.toFixed(1)} ({course.reviewsCount || 0})
              </div>
            )}
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {course.sections?.length || 0} sections
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {course.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{course.category}</Badge>
              <span className="text-sm text-muted-foreground">
                by {course.instructor?.name || "Unknown"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Button
              onClick={() => handleViewCourse(course._id)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Course
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddToCart(course._id)}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  const Pagination = () => (
    <div className="flex items-center justify-between mt-8">
      <div className="text-sm text-muted-foreground">
        Showing {(currentPage - 1) * coursesPerPage + 1} to{" "}
        {Math.min(currentPage * coursesPerPage, totalCourses)} of {totalCourses}{" "}
        courses
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page =
            Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Courses</h1>
          <p className="text-muted-foreground">
            Discover and learn from our comprehensive course catalog
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select
                value={categoryFilter || "all"}
                onValueChange={(value) =>
                  setCategoryFilter(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {courseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Level Filter */}
              <Select
                value={levelFilter || "all"}
                onValueChange={(value) =>
                  setLevelFilter(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
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
          </CardContent>
        </Card>

        {/* Results */}
        {error ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchCourses}>Try Again</Button>
            </CardContent>
          </Card>
        ) : courses.length > 0 ? (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "flex flex-col space-y-6"
              }
            >
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  viewMode={viewMode}
                />
              ))}
            </div>
            <Pagination />
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                No courses found matching your criteria
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("");
                  setLevelFilter("");
                  setSortBy("newest");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AllCourses;
