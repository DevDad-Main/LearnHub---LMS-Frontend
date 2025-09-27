import React from "react";
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

interface Instructor {
  name: string;
  title: string;
  avatar: string;
  rating: number;
  students: number;
  courses: number;
}

interface Course {
  id: string;
  title: string;
  instructor: Instructor;
  rating: number;
  reviewCount: number;
  price: number;
  thumbnail: string;
  description: string;
  category?: string;
  duration?: string;
  studentCount?: number;
  enrolledStudents: number;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  function formatDuration(seconds) {
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-background">
      <div className="relative h-48 w-full">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover"
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
              {/* ({course?.reviewCount?.toLocaleString()}) */}(
              {Math.floor(Math.random() * 2000)})
            </span>
          </div>
          {course.enrolledStudents && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
              {course?.enrolledStudents.length}
            </div>
          )}
        </div>

        {course.duration && (
          <div className="flex items-center mb-3 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {formatDuration(course?.duration)}
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
        <Button asChild size="sm">
          <Link to={`/course/${course.id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
