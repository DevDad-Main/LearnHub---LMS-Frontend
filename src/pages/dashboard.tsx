import React from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  CheckCircle,
  BookmarkIcon,
  BarChart2,
} from "lucide-react";

// Define a CourseCard component locally since we're having import issues
const CourseCard = ({
  id = "1",
  title = "Course Title",
  instructor = "Instructor Name",
  thumbnail = "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&q=80",
  rating = 4.5,
  price = 49.99,
  category = "Development",
  description = "Course description goes here",
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover"
        />
        <Badge className="absolute top-2 right-2">{category}</Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription>Instructor: {instructor}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <div className="text-amber-500 mr-1">★</div>
          <span className="font-medium mr-1">{rating.toFixed(1)}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="font-bold">${price.toFixed(2)}</span>
        <Button asChild>
          <Link to={`/course/${id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  totalLectures: number;
  completedLectures: number;
  category: string;
  lastAccessed?: Date;
}

const Dashboard = () => {
  // Mock data for enrolled courses
  const enrolledCourses: Course[] = [
    {
      id: "1",
      title: "Complete React Developer in 2023",
      instructor: "John Doe",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      progress: 65,
      totalLectures: 120,
      completedLectures: 78,
      category: "Web Development",
      lastAccessed: new Date("2023-06-15"),
    },
    {
      id: "2",
      title: "Advanced JavaScript Concepts",
      instructor: "Jane Smith",
      thumbnail:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
      progress: 32,
      totalLectures: 85,
      completedLectures: 27,
      category: "Programming",
      lastAccessed: new Date("2023-06-10"),
    },
    {
      id: "3",
      title: "UI/UX Design Masterclass",
      instructor: "Michael Johnson",
      thumbnail:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
      progress: 100,
      totalLectures: 64,
      completedLectures: 64,
      category: "Design",
      lastAccessed: new Date("2023-06-05"),
    },
  ];

  // Mock data for recommended courses
  const recommendedCourses = [
    {
      id: "4",
      title: "Node.js: The Complete Guide",
      instructor: "Alex Brown",
      thumbnail:
        "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&q=80",
      rating: 4.8,
      price: 89.99,
      category: "Backend Development",
      description: "Master Node.js and build powerful backend applications",
    },
    {
      id: "5",
      title: "Python for Data Science",
      instructor: "Sarah Wilson",
      thumbnail:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80",
      rating: 4.9,
      price: 94.99,
      category: "Data Science",
      description: "Learn Python for data analysis and machine learning",
    },
  ];

  // Learning statistics
  const learningStats = {
    totalHours: 42,
    coursesCompleted: 3,
    certificatesEarned: 2,
    currentStreak: 5,
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Learning Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and continue learning
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <BookOpen className="mr-2 h-4 w-4" /> Browse Courses
          </Button>
        </div>
      </div>

      {/* Learning Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hours Learned</p>
                <h3 className="text-2xl font-bold">
                  {learningStats.totalHours}
                </h3>
              </div>
              <Clock className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Courses Completed
                </p>
                <h3 className="text-2xl font-bold">
                  {learningStats.coursesCompleted}
                </h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Certificates Earned
                </p>
                <h3 className="text-2xl font-bold">
                  {learningStats.certificatesEarned}
                </h3>
              </div>
              <BookmarkIcon className="h-8 w-8 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <h3 className="text-2xl font-bold">
                  {learningStats.currentStreak} days
                </h3>
              </div>
              <BarChart2 className="h-8 w-8 text-orange-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different course views */}
      <Tabs defaultValue="in-progress" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses
              .filter((course) => course.progress < 100)
              .map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2">
                      {course.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <CardDescription>
                      Instructor: {course.instructor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{course.progress}% complete</span>
                        <span>
                          {course.completedLectures}/{course.totalLectures}{" "}
                          lectures
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last accessed: {course.lastAccessed?.toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/course/${course.id}`}>Continue Learning</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses
              .filter((course) => course.progress === 100)
              .map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Badge
                        variant="secondary"
                        className="text-lg font-semibold px-4 py-2"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Completed
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <CardDescription>
                      Instructor: {course.instructor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Completed all {course.totalLectures} lectures
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/course/${course.id}`}>Review Course</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="flex flex-col items-center justify-center py-12">
            <BookmarkIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No saved courses yet</h3>
            <p className="text-muted-foreground mb-4">
              Bookmark courses to save them for later
            </p>
            <Button variant="outline" asChild>
              <Link to="/">Browse Courses</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recommended Courses */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recommended For You</h2>
          <Button variant="link" asChild>
            <Link to="/">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              instructor={course.instructor}
              thumbnail={course.thumbnail}
              rating={course.rating}
              price={course.price}
              category={course.category}
              description={course.description}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {enrolledCourses.slice(0, 3).map((course, index) => (
                <div key={index} className="flex items-center gap-4 p-4">
                  <Avatar>
                    <AvatarImage src={course.thumbnail} alt={course.title} />
                    <AvatarFallback>
                      {course.title.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.completedLectures} of {course.totalLectures}{" "}
                      lectures completed
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/course/${course.id}`}>Resume</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
