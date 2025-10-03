import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Calendar,
  BookOpen,
  Users,
  Star,
  Clock,
  ArrowLeft,
  Loader2,
  ShoppingCart,
  Eye,
} from "lucide-react";

interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail: string;
  price: number;
  level: string;
  category: string;
  totalDuration: number;
  studentsEnrolled: number;
  rating: number;
  totalRatings: number;
  createdAt: string;
}

interface Instructor {
  _id: string;
  name: string;
  email: string;
  profession: string;
  bio: string;
  avatar: string;
  expertise: string[];
  createdCourses: Course[];
  createdAt: string;
  totalStudents: number;
  totalCourses: number;
  averageRating: number;
}

const InstructorProfilePage = () => {
  const { instructorId } = useParams<{ instructorId: string }>();
  const navigate = useNavigate();
  const { axios } = useAppContext();
  const { toast } = useToast();

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!instructorId) {
      setError("No instructor ID provided");
      setLoading(false);
      return;
    }

    const fetchInstructor = async () => {
      try {
        setLoading(true);
        const id = instructorId;
        const response = await axios.get(
          `/api/v1/instructor/get/instructor/${id}`,
        );
        setInstructor(response.data.instructor);
      } catch (err: any) {
        console.error("Error fetching instructor:", err);
        setError(
          err.response?.data?.message || "Failed to load instructor profile",
        );
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load instructor profile",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [instructorId, axios, toast]);

  const handleViewCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleAddToCart = async (courseId: string) => {
    try {
      await axios.post(`/api/v1/cart/add`, { courseId });
      toast({
        title: "Success",
        description: "Course added to cart successfully!",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err.response?.data?.message || "Failed to add course to cart",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  function formatDuration(seconds?: number) {
    if (!seconds) return "0m";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      if (minutes === 0 && seconds > 0) {
        return "1m"; // anything less than a minute rounds up
      }
      return `${minutes}m`;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading instructor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600 mb-4">
                {error || "Instructor not found"}
              </p>
              <Button onClick={() => navigate("/")}>Return to Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Back Button */}
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Instructor Header */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl">
                    {instructor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{instructor.name}</h1>
                  <p className="text-xl text-muted-foreground mb-4">
                    {instructor.profession}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{instructor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Instructor since {formatDate(instructor.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {instructor.totalCourses ||
                        instructor.createdCourses.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Courses</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {instructor.createdCourses.reduce((acc, course) => {
                        return acc + course.enrolledStudents.length;
                      }, 0)}
                      {/* {instructor.totalStudents || 0} */}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Students
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {instructor.averageRating?.toFixed(1) || "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {formatDuration(
                        instructor.createdCourses.reduce(
                          (acc, course) => acc + (course.totalDuration || 0),
                          0,
                        ),
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Content</div>
                  </div>
                </div>

                {/* Expertise */}
                {instructor.expertise && instructor.expertise.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {instructor.expertise.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {instructor.bio && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {instructor.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Courses by {instructor.name} ({instructor.createdCourses.length})
            </h2>
          </div>

          {instructor.createdCourses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  This instructor hasn't created any courses yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructor.createdCourses.map((course) => (
                <Card
                  key={course._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={
                        course.thumbnail ||
                        `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80`
                      }
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    {course.subtitle && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                        {course.subtitle}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {course.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating.toFixed(1)}</span>
                            <span>({course.totalRatings})</span>
                          </div>
                        )}
                        {course.totalDuration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatDuration(course.totalDuration)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">
                        ${course.price}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCourse(course._id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(course._id)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorProfilePage;
