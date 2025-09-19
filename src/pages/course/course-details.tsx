import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Infinity
} from "lucide-react";

const CourseDetails = () => {
  const { courseId } = useParams();

  // Mock course data - in real app this would come from API
  const course = {
    id: courseId || "1",
    title: "Complete React Developer in 2024",
    subtitle: "Learn React, Hooks, Redux, React Router, Next.js, Best Practices and build amazing projects",
    instructor: {
      name: "John Smith",
      title: "Senior Full Stack Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      rating: 4.8,
      students: 125000,
      courses: 12
    },
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    price: 89.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviewCount: 15420,
    studentCount: 89543,
    duration: "42 hours",
    lectures: 156,
    level: "All Levels",
    language: "English",
    category: "Web Development",
    tags: ["React", "JavaScript", "Frontend", "Web Development", "Redux"],
    lastUpdated: "November 2023",
    description: `Master React development from the ground up! This comprehensive course covers everything you need to know to become a professional React developer. You'll learn modern React with Hooks, state management with Redux, routing with React Router, and even Next.js for server-side rendering.

Perfect for beginners and intermediate developers looking to level up their React skills. By the end of this course, you'll have built several real-world projects and have the confidence to tackle any React project.`,
    whatYouWillLearn: [
      "Build powerful, fast, user-friendly and reactive web apps",
      "Provide amazing user experiences by leveraging the power of JavaScript",
      "Apply for high-paid jobs or work as a freelancer in one the most-demanded sectors",
      "Learn all about React Hooks and React Components",
      "Master Redux for state management",
      "Build real-world projects that you can add to your portfolio"
    ],
    requirements: [
      "Basic JavaScript knowledge is required",
      "NO prior React or any other JS framework experience is required!",
      "Basic HTML + CSS knowledge helps but is not a must-have"
    ],
    curriculum: [
      {
        section: "Getting Started",
        lectures: 8,
        duration: "1h 23m",
        lessons: [
          { title: "Course Introduction", duration: "5:32", isPreview: true },
          { title: "What is React?", duration: "8:45", isPreview: true },
          { title: "Setting up the Development Environment", duration: "12:15", isPreview: false },
          { title: "Creating Your First React App", duration: "15:30", isPreview: false },
          { title: "Understanding JSX", duration: "18:22", isPreview: false },
          { title: "Components and Props", duration: "14:45", isPreview: false },
          { title: "State and Event Handling", duration: "16:33", isPreview: false },
          { title: "Section Summary", duration: "3:45", isPreview: false }
        ]
      },
      {
        section: "React Fundamentals",
        lectures: 12,
        duration: "2h 45m",
        lessons: [
          { title: "Component Lifecycle", duration: "22:15", isPreview: false },
          { title: "Handling Forms", duration: "18:30", isPreview: false },
          { title: "Lists and Keys", duration: "15:45", isPreview: false },
          { title: "Conditional Rendering", duration: "12:20", isPreview: false },
          { title: "Styling Components", duration: "20:10", isPreview: false },
          { title: "React Hooks Introduction", duration: "25:30", isPreview: false },
          { title: "useState Hook", duration: "18:45", isPreview: false },
          { title: "useEffect Hook", duration: "24:15", isPreview: false },
          { title: "Custom Hooks", duration: "19:30", isPreview: false },
          { title: "Context API", duration: "21:45", isPreview: false },
          { title: "Error Boundaries", duration: "16:20", isPreview: false },
          { title: "Section Project", duration: "35:40", isPreview: false }
        ]
      },
      {
        section: "Advanced React Concepts",
        lectures: 15,
        duration: "3h 20m",
        lessons: [
          { title: "Performance Optimization", duration: "28:15", isPreview: false },
          { title: "React.memo and useMemo", duration: "22:30", isPreview: false },
          { title: "useCallback Hook", duration: "18:45", isPreview: false },
          { title: "Code Splitting", duration: "20:10", isPreview: false },
          { title: "Lazy Loading", duration: "16:30", isPreview: false },
          // ... more lessons
        ]
      }
    ]
  };

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
                  {course.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {course.title}
                </h1>
                <p className="text-lg text-slate-300 mb-6">
                  {course.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-semibold mr-1">{course.rating}</span>
                  <span className="text-slate-300">
                    ({course.reviewCount.toLocaleString()} ratings)
                  </span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Users className="h-4 w-4 mr-1" />
                  {course.studentCount.toLocaleString()} students
                </div>
                <div className="flex items-center text-slate-300">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duration}
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center mb-6">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={course.instructor.avatar} />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Created by {course.instructor.name}</p>
                  <p className="text-slate-300 text-sm">{course.instructor.title}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  {course.language}
                </div>
                <div>Last updated {course.lastUpdated}</div>
              </div>
            </div>

            {/* Course Preview Card - Mobile/Tablet */}
            <div className="lg:hidden">
              <Card>
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
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
                      <span className="text-3xl font-bold">${course.price}</span>
                      <span className="text-lg text-muted-foreground line-through ml-2">
                        ${course.originalPrice}
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
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
                      {course.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Course content */}
                <Card>
                  <CardHeader>
                    <CardTitle>Course content</CardTitle>
                    <CardDescription>
                      {course.curriculum.reduce((acc, section) => acc + section.lectures, 0)} lectures • {course.duration} total length
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.curriculum.slice(0, 2).map((section, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">{section.section}</h4>
                            <span className="text-sm text-muted-foreground">
                              {section.lectures} lectures • {section.duration}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {section.lessons.slice(0, 3).map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                  {lesson.isPreview ? (
                                    <Play className="h-4 w-4 mr-2 text-primary" />
                                  ) : (
                                    <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                                  )}
                                  <span className={lesson.isPreview ? "text-primary" : "text-muted-foreground"}>
                                    {lesson.title}
                                  </span>
                                  {lesson.isPreview && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      Preview
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-muted-foreground">{lesson.duration}</span>
                              </div>
                            ))}
                            {section.lessons.length > 3 && (
                              <p className="text-sm text-muted-foreground">
                                + {section.lessons.length - 3} more lectures
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        Show all sections
                      </Button>
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
                      {course.requirements.map((req, index) => (
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
                      {course.description.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
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
                      {course.curriculum.reduce((acc, section) => acc + section.lectures, 0)} lectures • {course.duration} total length
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.curriculum.map((section, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-lg">{section.section}</h4>
                            <span className="text-sm text-muted-foreground">
                              {section.lectures} lectures • {section.duration}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                                <div className="flex items-center">
                                  {lesson.isPreview ? (
                                    <Play className="h-4 w-4 mr-3 text-primary" />
                                  ) : (
                                    <Lock className="h-4 w-4 mr-3 text-muted-foreground" />
                                  )}
                                  <span className={lesson.isPreview ? "text-primary" : "text-muted-foreground"}>
                                    {lesson.title}
                                  </span>
                                  {lesson.isPreview && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      Preview
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-muted-foreground text-sm">{lesson.duration}</span>
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
                    <div className="flex items-start space-x-4 mb-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={course.instructor.avatar} />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{course.instructor.name}</h3>
                        <p className="text-muted-foreground mb-3">{course.instructor.title}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            {course.instructor.rating} Instructor Rating
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {course.instructor.students.toLocaleString()} Students
                          </div>
                          <div className="flex items-center">
                            <Play className="h-4 w-4 mr-1" />
                            {course.instructor.courses} Courses
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p>
                        John is a senior full-stack developer with over 8 years of experience in web development. 
                        He has worked with companies ranging from startups to Fortune 500 companies, building 
                        scalable web applications using modern technologies.
                      </p>
                      <p>
                        His expertise includes React, Node.js, Python, and cloud technologies. John is passionate 
                        about teaching and has helped thousands of students transition into successful tech careers.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                    <CardDescription>
                      {course.reviewCount.toLocaleString()} reviews for this course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Review Summary */}
                      <div className="flex items-center space-x-8">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-yellow-500">{course.rating}</div>
                          <div className="flex items-center justify-center mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.floor(course.rating)
                                    ? "text-yellow-500 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground">Course Rating</div>
                        </div>
                        <div className="flex-1">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center mb-1">
                              <span className="text-sm w-8">{rating}★</span>
                              <div className="flex-1 h-2 bg-muted rounded-full mx-2">
                                <div
                                  className="h-full bg-yellow-500 rounded-full"
                                  style={{
                                    width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%`
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-muted-foreground w-8">
                                {rating === 5 ? "70%" : rating === 4 ? "20%" : rating === 3 ? "7%" : rating === 2 ? "2%" : "1%"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Individual Reviews */}
                      <div className="space-y-6">
                        {[1, 2, 3].map((review) => (
                          <div key={review} className="border-b pb-6 last:border-b-0">
                            <div className="flex items-start space-x-4">
                              <Avatar>
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${review}`} />
                                <AvatarFallback>U{review}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-semibold">Student {review}</span>
                                  <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className="h-4 w-4 text-yellow-500 fill-current"
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">2 weeks ago</span>
                                </div>
                                <p className="text-sm">
                                  Excellent course! The instructor explains everything clearly and the projects 
                                  are very practical. I learned so much about React and feel confident building 
                                  my own applications now.
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
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
                    src={course.thumbnail}
                    alt={course.title}
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
                      <span className="text-3xl font-bold">${course.price}</span>
                      <span className="text-lg text-muted-foreground line-through ml-2">
                        ${course.originalPrice}
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
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Play className="h-4 w-4 mr-2" />
                        Lectures
                      </span>
                      <span>{course.lectures}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Level
                      </span>
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Language
                      </span>
                      <span>{course.language}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Mobile Access
                      </span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Downloadable
                      </span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Infinity className="h-4 w-4 mr-2" />
                        Lifetime Access
                      </span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h4 className="font-semibold">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
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