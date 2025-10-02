import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppContext.jsx";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users } from "lucide-react";
import axios from "axios";
import { toast, useToast } from "../ui/use-toast";

interface Instructor {
  name: string;
  title: string;
  avatar: string;
  rating: number;
  students: number;
  courses: number;
}

interface Course {
  _id: string;
  title: string;
  instructor: Instructor;
  rating: number;
  reviewCount: number;
  price: number;
  thumbnail: string;
  description: string;
  category?: string;
  duration?: number; // duration in seconds
  studentCount?: number;
  enrolledStudents: number; // ✅ clarified as number
}

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const { toast } = useToast();
  const { navigate, studentCourses, getCartItems } = useAppContext();

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

  async function handleAddToCart() {
    try {
      const { data } = await axios.post("/api/v1/users/cart/add", {
        courseId: course._id,
      });

      if (data.success) {
        toast({
          title: "Course Added To Cart",
          description: `You have added ${course.title} to your cart!`,
        });
        await getCartItems();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.response?.data?.message || "Failed to load course",
        });
      }
      // you could fire a toast/notification here
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to load course",
      });
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-background">
      <div className="relative h-48 w-full">
        <img
          onClick={() => navigate(`/course/${course._id}`)}
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover cursor-pointer"
        />
        {course.category && (
          <Badge className="absolute top-2 right-2" variant="secondary">
            {course.category}
          </Badge>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg leading-tight">
          {course.title}
        </CardTitle>
        <CardDescription className="text-sm">
          By {course.instructor?.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-4">
            <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
            <span className="font-medium text-sm mr-1">
              {course?.rating?.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({course.reviewCount?.toLocaleString() ?? 0})
            </span>
          </div>
          {course.enrolledStudents > 0 && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
              {course.enrolledStudents.toLocaleString()}
            </div>
          )}
        </div>

        {course.duration && (
          <div className="flex items-center mb-3 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {formatDuration(course.duration)}
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {course.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-3">
        <div className="flex items-center">
          <span className="font-bold text-lg">${course.price.toFixed(2)}</span>
        </div>

        {studentCourses?.find((sc) => sc.course._id === course._id) ? (
          <Button asChild size="sm">
            <Link to={`/course/learn/${course._id}`}>Continue Watching</Link>
          </Button>
        ) : (
          <Button size="sm" onClick={handleAddToCart}>
            Add To Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
