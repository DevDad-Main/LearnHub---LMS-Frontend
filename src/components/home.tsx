import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import CourseCard from "./course/CourseCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  TrendingUp,
  Clock,
  Eye,
  Star,
  Users,
  PlayCircle,
  BookOpen,
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

const featuredCourses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    instructor: "Jane Smith",
    rating: 4.8,
    reviewCount: 1245,
    price: 89.99,
    thumbnail:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
    description:
      "Learn HTML, CSS, JavaScript, React, Node.js and more to become a full-stack web developer.",
  },
  {
    id: "2",
    title: "Python for Data Science and Machine Learning",
    instructor: "John Doe",
    rating: 4.9,
    reviewCount: 2341,
    price: 94.99,
    thumbnail:
      "https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?w=800&q=80",
    description:
      "Master Python for data analysis, visualization, machine learning, and deep learning.",
  },
  {
    id: "3",
    title: "iOS App Development with Swift",
    instructor: "Sarah Johnson",
    rating: 4.7,
    reviewCount: 987,
    price: 79.99,
    thumbnail:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    description:
      "Build iOS apps from scratch using Swift and Xcode. Create your own apps for the App Store.",
  },
  {
    id: "4",
    title: "Digital Marketing Masterclass",
    instructor: "Michael Brown",
    rating: 4.6,
    reviewCount: 1532,
    price: 69.99,
    thumbnail:
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&q=80",
    description:
      "Learn SEO, social media marketing, email campaigns, and more to grow your business online.",
  },
  {
    id: "5",
    title: "Complete React Developer Course",
    instructor: "Alex Wilson",
    rating: 4.8,
    reviewCount: 1876,
    price: 84.99,
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    description:
      "Master React from basics to advanced concepts. Build real-world projects and get job-ready.",
  },
  {
    id: "6",
    title: "UI/UX Design Fundamentals",
    instructor: "Emma Davis",
    rating: 4.7,
    reviewCount: 1123,
    price: 74.99,
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    description:
      "Learn design principles, user research, wireframing, and prototyping to create amazing user experiences.",
  },
  {
    id: "7",
    title: "Node.js Backend Development",
    instructor: "David Chen",
    rating: 4.6,
    reviewCount: 892,
    price: 79.99,
    thumbnail:
      "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&q=80",
    description:
      "Build scalable backend applications with Node.js, Express, and MongoDB. Learn REST APIs and authentication.",
  },
  {
    id: "8",
    title: "Advanced JavaScript Concepts",
    instructor: "Lisa Rodriguez",
    rating: 4.9,
    reviewCount: 1654,
    price: 89.99,
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
    description:
      "Deep dive into JavaScript closures, prototypes, async programming, and modern ES6+ features.",
  },
];

// Mock recently viewed courses
const recentlyViewed = [
  {
    id: "68d30bb4b1cb645920d609c6",
    title: "Vue.js Complete Guide",
    instructor: "Mark Thompson",
    rating: 4.6,
    reviewCount: 892,
    price: 79.99,
    thumbnail:
      "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80",
    description:
      "Learn Vue.js from scratch and build amazing single-page applications.",
    lastViewed: "2 days ago",
    progress: 35,
  },
  {
    id: 10,
    title: "Docker & Kubernetes Masterclass",
    instructor: "Robert Kim",
    rating: 4.8,
    reviewCount: 1456,
    price: 99.99,
    thumbnail:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80",
    description:
      "Master containerization and orchestration with Docker and Kubernetes.",
    lastViewed: "1 week ago",
    progress: 12,
  },
  {
    id: 11,
    title: "GraphQL with React",
    instructor: "Anna Martinez",
    rating: 4.7,
    reviewCount: 743,
    price: 84.99,
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    description:
      "Build modern APIs with GraphQL and integrate with React applications.",
    lastViewed: "3 days ago",
    progress: 67,
  },
];

// Mock trending courses
const trendingCourses = [
  {
    id: 12,
    title: "AI & ChatGPT for Developers",
    instructor: "Dr. Sarah Chen",
    rating: 4.9,
    reviewCount: 2847,
    price: 129.99,
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    description:
      "Learn to integrate AI and ChatGPT into your development workflow.",
    trending: true,
    enrollmentGrowth: "+245%",
  },
  {
    id: 13,
    title: "Next.js 14 Complete Course",
    instructor: "James Wilson",
    rating: 4.8,
    reviewCount: 1923,
    price: 94.99,
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    description:
      "Master the latest Next.js features including App Router and Server Components.",
    trending: true,
    enrollmentGrowth: "+189%",
  },
  {
    id: 14,
    title: "Cybersecurity Fundamentals",
    instructor: "Michael Torres",
    rating: 4.7,
    reviewCount: 1567,
    price: 109.99,
    thumbnail:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    description:
      "Essential cybersecurity skills for developers and IT professionals.",
    trending: true,
    enrollmentGrowth: "+156%",
  },
];

// Mock recommended courses
const recommendedCourses = [
  {
    id: 15,
    title: "TypeScript Masterclass",
    instructor: "Elena Petrov",
    rating: 4.8,
    reviewCount: 1234,
    price: 89.99,
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    description:
      "Master TypeScript and write better, more maintainable JavaScript code.",
    matchReason: "Based on your interest in JavaScript",
  },
  {
    id: 16,
    title: "AWS Cloud Practitioner",
    instructor: "Carlos Rodriguez",
    rating: 4.6,
    reviewCount: 2156,
    price: 119.99,
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    description: "Get AWS certified and learn cloud computing fundamentals.",
    matchReason: "Popular with web developers",
  },
];

const Home = () => {
  const { user, navigate } = useAppContext();

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
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
                <Link to="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Join for free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Continue Learning Section */}
        {user ? (
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
                {recentlyViewed.map((course) => (
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
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => navigate(`/course/learn/${course.id}`)}
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
                        {course.progress}% complete
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-2 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        By {course.instructor}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Last viewed {course.lastViewed}</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                          {course.rating}
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ) : null}

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
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-16 bg-muted/20">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Featured Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
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
