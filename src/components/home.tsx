import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import CourseCard from "./course/CourseCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  TrendingUp,
  Clock,
  Star,
  PlayCircle,
  Award,
  ChevronRight,
} from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

const categories = [
  { id: 1, name: "Web Development" },
  { id: 2, name: "Mobile Development" },
  { id: 3, name: "Data Science" },
  { id: 4, name: "Machine Learning" },
  { id: 5, name: "Business" },
  { id: 6, name: "Marketing" },
  { id: 7, name: "Design" },
  { id: 8, name: "Photography" },
];

// Example featured courses (same as before)
const featuredCourses = [
  /* ... your mock featuredCourses ... */
];
const trendingCourses = [
  /* ... your mock trendingCourses ... */
];
const recommendedCourses = [
  /* ... your mock recommendedCourses ... */
];

const Home = () => {
  const {
    user,
    navigate,
    coursesProgress,
    fetchEnrolledCourses,
    studentCourses,
    featuredCourses,
  } = useAppContext();

  const getCourseProgress = (courseProgress) => {
    if (!courseProgress?.course?.sections) return 0;
    const allLectures = courseProgress.course.sections.flatMap(
      (s) => s.lectures || [],
    );
    const completedCount = courseProgress.completedLectures?.length || 0;
    return allLectures.length
      ? Math.round((completedCount / allLectures.length) * 100)
      : 0;
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-muted/50 to-background py-20 md:py-32">
          <div className="container">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Learn without limits
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Start, switch, or advance your career with thousands of courses
                from expert instructors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={"/courses"}>
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore courses
                  </Button>
                </Link>
                {!user ? (
                  <Link to="/register">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Join for free
                    </Button>
                  </Link>
                ) : (
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Continue Learning */}
        {user && studentCourses.length > 0 && (
          <section className="py-8 bg-muted/20">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <Clock className="h-6 w-6 mr-2 text-primary" />
                  <h2 className="text-3xl font-bold">Continue Learning</h2>
                </div>
                <Link to="/my-learning">
                  <Button variant="ghost" className="text-primary">
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  // ✅ Deduplicate by course ID first
                  ...new Map(
                    studentCourses.map((c) => [c.course?._id, c]),
                  ).values(),
                ]
                  .slice(0, 6) // ✅ Only take the first 6 unique courses
                  .map((studentCourse) => {
                    const progressData = coursesProgress?.find(
                      (p) => p.course?._id === studentCourse.course?._id,
                    );
                    const progress = progressData
                      ? getCourseProgress(progressData)
                      : 0;

                    if (progressData?.isCompleted) return null;

                    return (
                      <Card
                        key={studentCourse.course?._id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="relative">
                          <img
                            src={studentCourse.course?.thumbnail}
                            alt={studentCourse.course?.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button
                              onClick={() => {
                                window.scrollTo(0, 0);
                                navigate(
                                  `/course/learn/${studentCourse.course?._id}`,
                                );
                              }}
                              size="lg"
                              className="rounded-full"
                            >
                              <PlayCircle className="h-6 w-6 mr-2" />
                              Continue
                            </Button>
                          </div>
                          <Badge
                            className="absolute top-2 right-2"
                            variant="secondary"
                          >
                            {progress}% complete
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold line-clamp-2 mb-2">
                            {studentCourse.course?.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            By {studentCourse.course?.instructor?.name}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              Last viewed {studentCourse.course?.lastViewed}
                            </span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                              {studentCourse.course?.rating}
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          </section>
        )}
        {/* Featured Courses */}
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold mb-2">Featured Courses</h2>
              <Link to="/courses">
                <Button variant="ghost" className="text-primary">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>

        {/* Trending Courses */}
        <section className="py-8">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-primary" />
                <h2 className="text-3xl font-bold">Trending Now</h2>
              </div>
              <Link to="/trending">
                <Button variant="ghost" className="text-primary">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingCourses.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                    <Badge
                      className="absolute top-2 right-2"
                      variant="secondary"
                    >
                      {course.enrollmentGrowth}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      By {course.instructor}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span className="font-medium mr-1">
                          {course.rating}
                        </span>
                        <span className="text-muted-foreground">
                          ({course.reviewCount.toLocaleString()})
                        </span>
                      </div>
                      <span className="font-bold">${course.price}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/courses">
                <Button size="lg" variant="outline">
                  View all courses
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Recommended for You */}
        {user ? (
          <section className="py-16">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <Award className="h-6 w-6 mr-2 text-primary" />
                  <h2 className="text-3xl font-bold">Recommended for You</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="flex">
                      <div className="w-48 h-32">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-4">
                        <Badge variant="outline" className="mb-2 text-xs">
                          {course.matchReason}
                        </Badge>
                        <h3 className="font-semibold line-clamp-2 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          By {course.instructor}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm">
                            <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                            <span className="font-medium mr-1">
                              {course.rating}
                            </span>
                            <span className="text-muted-foreground">
                              ({course.reviewCount.toLocaleString()})
                            </span>
                          </div>
                          <span className="font-bold">${course.price}</span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Categories Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Browse Categories</h2>
            <Tabs defaultValue="popular">
              <TabsList className="mb-8">
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="new">New & Trending</TabsTrigger>
                <TabsTrigger value="beginner">For Beginners</TabsTrigger>
              </TabsList>
              <TabsContent value="popular" className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/categories/${category.id}`}
                      className="bg-background rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-medium text-lg mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Explore courses
                      </p>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="new" className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories
                    .slice()
                    .reverse()
                    .map((category) => (
                      <Link
                        key={category.id}
                        to={`/categories/${category.id}`}
                        className="bg-background rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-medium text-lg mb-2">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Explore courses
                        </p>
                      </Link>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="beginner" className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.slice(0, 4).map((category) => (
                    <Link
                      key={category.id}
                      to={`/categories/${category.id}`}
                      className="bg-background rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-medium text-lg mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Explore courses
                      </p>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Learning Stats */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Join Millions of Learners
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform has helped students worldwide achieve their
                learning goals
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">2M+</div>
                <div className="text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-muted-foreground">Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">190+</div>
                <div className="text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">
              What Our Students Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-background rounded-lg p-6 shadow-sm border"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                        alt="User avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">Student Name {i}</h4>
                      <p className="text-sm text-muted-foreground">
                        Web Development
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "The courses on LearnHub have been instrumental in advancing
                    my career. The instructors are knowledgeable and the content
                    is up-to-date with industry standards."
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Start Learning Today</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of students already learning on LearnHub. Get
              unlimited access to all courses.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Sign up for free
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
