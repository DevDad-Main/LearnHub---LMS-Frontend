import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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
import { useAppContext } from "../context/AppContext.jsx";

// Local CourseCard for Recommended Courses
const CourseCard = ({
  id = "1",
  title = "Course Title",
  instructor = "Instructor Name",
  thumbnail = "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&q=80",
  rating = 4.5,
  price = 49.99,
  category = "Development",
  description = "Course description goes here",
}) => (
  <Card className="overflow-hidden">
    <div className="relative h-48 w-full">
      <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
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

const Dashboard = () => {
  const learningStats = {
    totalHours: 42,
    coursesCompleted: 3,
    certificatesEarned: 2,
    currentStreak: 5,
  };

  const recommendedCourses = [];
  const location = useLocation();
  const { toast } = useToast();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [coursesProgress, setCoursesProgress] = useState([]);
  const [totalTimeLearning, setTotalTimeLearning] = useState(0);
  const { axios, user } = useAppContext();

  const fetchUserDashboard = async () => {
    try {
      const { data } = await axios.get("/api/v1/users/dashboard");

      if (data.success) {
        setEnrolledCourses(data.user.enrolledCourses || []);
        setCoursesProgress(data.courseProgress || []);
        setTotalTimeLearning(data.totalTimeLearning);
      } else {
        toast({
          variant: "destructive",
          title: "Dashboard Failed",
          description: data.response?.data?.message || data.message,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Dashboard Failed",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  function formatDuration(seconds?: number) {
    if (!seconds) return "0m";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hours ${minutes} minutes`;
    } else {
      if (minutes === 0 && seconds > 0) {
        return "1m"; // anything less than a minute rounds up
      }
      return `${minutes} minutes`;
    }
  }

  // Merge courses with their progress
  const mergedCourses = enrolledCourses.map((enrolled) => {
    const progress = coursesProgress.find(
      (p) => p.course._id === enrolled.course._id,
    );
    const totalLectures = progress
      ? progress.course.sections.flatMap((s) => s.lectures || []).length
      : 0;

    return { ...enrolled, progress, totalLectures };
  });

  const getCourseProgress = (courseProgress) => {
    const allLectures = courseProgress.course.sections.flatMap(
      (s) => s.lectures || [],
    );
    const completedCount = courseProgress.completedLectures?.length || 0;
    return Math.round((completedCount / allLectures.length) * 100);
  };

  useEffect(() => {
    fetchUserDashboard();
  }, [user, axios]);

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
                <p className="text-sm text-muted-foreground">
                  Time Spent Learning
                </p>
                <h3 className="text-2xl font-bold">
                  {formatDuration(totalTimeLearning)}
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
                  {mergedCourses
                    .filter((course) => course.progress?.isCompleted)
                    .reduce(
                      (acc, course) => acc + course.progress?.isCompleted,
                      0,
                    )}
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
                  {mergedCourses
                    .filter((course) => course.progress?.isCompleted)
                    .reduce(
                      (acc, course) => acc + course.progress?.isCompleted,
                      0,
                    )}
                  {/* {learningStats.certificatesEarned} */}
                </h3>
              </div>
              <BookmarkIcon className="h-8 w-8 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* // TODO: Add current streak */}
        {/* <Card> */}
        {/*   <CardContent className="pt-6"> */}
        {/*     <div className="flex items-center justify-between"> */}
        {/*       <div> */}
        {/*         <p className="text-sm text-muted-foreground">Current Streak</p> */}
        {/*         <h3 className="text-2xl font-bold"> */}
        {/*           {learningStats.currentStreak} days */}
        {/*         </h3> */}
        {/*       </div> */}
        {/*       <BarChart2 className="h-8 w-8 text-orange-500 opacity-80" /> */}
        {/*     </div> */}
        {/*   </CardContent> */}
        {/* </Card> */}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="in-progress" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        {/* In Progress */}
        <TabsContent value="in-progress">
          <h3 className="text-2xl font-bold mb-3">Continue Learning</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mergedCourses
              .filter((course) => !course.progress?.isCompleted)
              .slice(0, 6)
              .map((course) => {
                const completedCount =
                  course.progress?.completedLectures?.length || 0;
                const progressPercent = course.progress
                  ? Math.round((completedCount / course.totalLectures) * 100)
                  : 0;

                return (
                  <Card key={course.course._id} className="overflow-hidden">
                    <div className="relative h-48 w-full">
                      <img
                        src={course.course?.thumbnail}
                        alt={course.course?.title}
                        className="h-full w-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2">
                        {course.course?.category}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">
                        {course.course?.title}
                      </CardTitle>
                      <CardDescription>
                        Instructor: {course.course?.instructor?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress: {progressPercent}%</span>
                          <span>
                            {completedCount}/{course.totalLectures} lectures
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last accessed:{" "}
                        {course.progress?.lastAccessed
                          ? new Date(
                              course.progress?.lastAccessed,
                            ).toLocaleDateString()
                          : "Never"}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to={`/course/learn/${course.course._id}`}>
                          Continue Learning
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        {/* Completed */}
        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mergedCourses
              .filter((course) => course.progress?.isCompleted)
              .map((course) => (
                <Card key={course.course._id} className="overflow-hidden">
                  <div className="relative h-48 w-full">
                    <img
                      src={course.course?.thumbnail}
                      alt={course.course?.title}
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
                      {course.course?.title}
                    </CardTitle>
                    <CardDescription>
                      Instructor: {course.course?.instructor?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Completed all {course.totalLectures} lectures
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/course/${course.course._id}`}>
                        Review Course
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Saved */}
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

      {/* Enrolled Courses */}
      {/* <div className="mb-8"> */}
      {/*   <div className="flex justify-between items-center mb-4"> */}
      {/*     <h2 className="text-2xl font-bold">Enrolled Courses</h2> */}
      {/*     <Button variant="link" asChild> */}
      {/*       <Link to="/">View All</Link> */}
      {/*     </Button> */}
      {/*   </div> */}
      {/*   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
      {/*     {enrolledCourses.map((course) => ( */}
      {/*       <CourseCard */}
      {/*         key={course.course?._id} */}
      {/*         id={course.course?._id} */}
      {/*         title={course.course?.title} */}
      {/*         instructor={course.course?.instructor?.name} */}
      {/*         thumbnail={course.course?.thumbnail} */}
      {/*         rating={course.rating} */}
      {/*         price={course.course?.price} */}
      {/*         category={course.course?.category} */}
      {/*         description={course.course?.description} */}
      {/*       /> */}
      {/*     ))} */}
      {/*   </div> */}
      {/* </div> */}

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
    </div>
  );
};

export default Dashboard;
