import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Clock,
  Users,
  Award,
  Play,
  Lock,
  CheckCircle,
  Globe,
  Smartphone,
  Download,
  Infinity,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext.jsx";

const CourseDetails = () => {
  const { id } = useParams();
  const { axios, navigate } = useAppContext();
  const [course, setCourse] = useState(null);
  const [totalLectures, setTotalLectures] = useState(0);

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

  useEffect(() => {
    if (!id) return;

    const fetchCourseById = async () => {
      try {
        const { data } = await axios.get(`/api/v1/course/c/${id}`);
        if (data.success) {
          setCourse(data.course);
          console.log(data);

          setTotalLectures(
            data.course?.sections?.reduce((previous, current) => {
              return previous + current.lectures.length;
            }, 0),
          );
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Failed to fetch course:", err);
      }
    };
    fetchCourseById();
  }, [id, axios]);

  if (!course) {
    return <div className="p-6 text-center">Loading course...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2">
                  {course?.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {course?.title}
                </h1>
                <p className="text-lg text-slate-300 mb-6">
                  {course?.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-semibold mr-1">{course?.rating}</span>
                  <span className="text-slate-300">
                    {/* ({course?.reviewCount?.toLocaleString()} ratings) */}(
                    {"12,632"} ratings)
                  </span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Users className="h-4 w-4 mr-1" />
                  {course?.enrolledStudents}{" "}
                  {course?.enrolledStudents.length === 1
                    ? "students"
                    : "student"}
                </div>
                <div className="flex items-center text-slate-300">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(course?.duration)}
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center mb-6">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={course?.instructor?.avatar} />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    Created by {course?.instructor?.name}
                  </p>
                  <p className="text-slate-300 text-sm">
                    {course?.instructor?.title}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  {course?.language}
                </div>
                <div>
                  Last updated{" "}
                  {new Date(course?.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Course Preview Card - Mobile/Tablet */}
            <div className="lg:hidden">
              <Card>
                <div className="relative">
                  <img
                    src={course?.thumbnail}
                    alt={course?.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    size="lg"
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full"
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold">
                        ${course?.price}
                      </span>
                      <span className="text-lg text-muted-foreground line-through ml-2">
                        ${272}
                      </span>
                    </div>
                    <Badge variant="destructive">67% off</Badge>
                  </div>
                  <Button className="w-full mb-3" size="lg">
                    Add to cart
                  </Button>
                  <Button variant="outline" className="w-full mb-4">
                    Buy now
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    30-Day Money-Back Guarantee
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* What you'll learn */}
                <Card>
                  <CardHeader>
                    <CardTitle>What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course?.learnableSkills?.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course?.requirements?.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-foreground rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {course?.description
                        ?.split("\n\n")
                        .map((paragraph, index) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Curriculum</CardTitle>
                    <CardDescription>
                      {course?.curriculum?.reduce(
                        (acc, section) => acc + section.lectures,
                        0,
                      )}{" "}
                      lectures • {formatDuration(course?.duration)} total length
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course?.sections.map((section, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-lg">
                              {section.title}
                            </h4>
                            <span className="text-sm text-muted-foreground">
                              {section.lectures.length} lectures •{" "}
                              {formatDuration(section.duration)}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {section.lectures?.map((lesson, lessonIndex) => (
                              <div
                                key={lessonIndex}
                                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
                              >
                                <div className="flex items-center">
                                  {lesson.isPreview ? (
                                    <Play className="h-4 w-4 mr-3 text-primary" />
                                  ) : (
                                    <Lock className="h-4 w-4 mr-3 text-muted-foreground" />
                                  )}
                                  <span
                                    className={
                                      lesson.isPreview
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                    }
                                  >
                                    {lesson.title}
                                  </span>
                                  {lesson.isPreview && (
                                    <Badge
                                      variant="outline"
                                      className="ml-2 text-xs"
                                    >
                                      Preview
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-muted-foreground text-sm">
                                  {formatDuration(lesson.duration)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Profile Section */}
                    <div className="flex items-start space-x-6 mb-8">
                      <Avatar className="h-24 w-24 ring-2 ring-primary/20">
                        <AvatarImage src={course?.instructor?.avatar} />
                        <AvatarFallback>
                          {course?.instructor?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-2xl font-bold mb-1">
                          {course?.instructor?.name}
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          {course?.instructor?.title ||
                            course?.instructor?.profession}
                        </p>
                        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            {course?.instructor?.rating || "N/A"} Rating
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {course?.totalStudents?.toLocaleString() || 0}{" "}
                            Students
                          </div>
                          <div className="flex items-center">
                            <Play className="h-4 w-4 mr-1" />
                            {course?.instructor?.createdCourses.length ||
                              0}{" "}
                            Courses
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bio Section */}
                    {course?.instructor?.bio && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">About</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {course?.instructor?.bio}
                        </p>
                      </div>
                    )}

                    {/* Expertise Section */}
                    {course?.instructor?.expertise?.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {course?.instructor?.expertise.map(
                            (skill: string, i: number) => (
                              <span
                                key={i}
                                className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary"
                              >
                                {skill}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Created Courses Section */}
                    {course?.instructor?.createdCourses?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">
                          More Courses by {course?.instructor?.name}
                        </h4>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {course?.instructor?.createdCourses.map((c: any) => (
                            <div
                              key={c._id}
                              onClick={() => navigate(`/course/${c._id}`)}
                              className="cursor-pointer border rounded-lg p-3 hover:shadow-md transition"
                            >
                              <h5 className="font-medium line-clamp-2">
                                {c.title}
                              </h5>
                              <p className="text-xs text-muted-foreground mt-1">
                                {c.subtitle}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                    <CardDescription>
                      {course?.reviewCount?.toLocaleString()} reviews for this
                      course
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block">
            <div className="sticky top-4">
              <Card>
                <div className="relative">
                  <img
                    src={course?.thumbnail}
                    alt={course?.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    size="lg"
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full"
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold">
                        ${course?.price}
                      </span>
                      <span className="text-lg text-muted-foreground line-through ml-2">
                        ${272}
                      </span>
                    </div>
                    <Badge variant="destructive">67% off</Badge>
                  </div>
                  <Button className="w-full mb-3" size="lg">
                    Add to cart
                  </Button>
                  <Button variant="outline" className="w-full mb-4">
                    Buy now
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    30-Day Money-Back Guarantee
                  </p>

                  <Separator className="my-4" />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Duration
                      </span>
                      <span>{formatDuration(course?.duration)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Play className="h-4 w-4 mr-2" />
                        Lectures
                      </span>
                      <span>{totalLectures}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Level
                      </span>
                      <span>{course?.level}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        {course?.languages?.length === 1
                          ? "Language"
                          : "Languages"}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {course?.languages?.map((lang, index) => (
                          <span key={index}>{`${lang}`}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h4 className="font-semibold">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {course?.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
