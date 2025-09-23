import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Settings,
  Bell,
  User,
  BookOpen,
  BarChart3,
  DollarSign,
} from "lucide-react";
import CourseGrid from "./CourseGrid";
import CourseForm from "./CourseForm";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const handleCreateCourse = () => {
    setIsCreatingCourse(true);
    setEditingCourse(null);
    setActiveTab("create");
  };

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setIsCreatingCourse(false);
    setActiveTab("create");
  };

  const handleBackToCourses = () => {
    setActiveTab("courses");
    setIsCreatingCourse(false);
    setEditingCourse(null);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">EduPlatform</h2>
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>

        <nav className="space-y-2 flex-1">
          <Button
            variant={activeTab === "courses" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("courses")}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Course Management
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <BarChart3 className="h-5 w-5 mr-2" />
            Analytics
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <DollarSign className="h-5 w-5 mr-2" />
            Revenue
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <User className="h-5 w-5 mr-2" />
            User Management
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </Button>
        </nav>

        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <User size={20} />
            </div>
            <div className="ml-3">
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold">
              {activeTab === "courses"
                ? "Course Management"
                : isCreatingCourse
                  ? "Create New Course"
                  : "Edit Course"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell size={20} />
            </Button>
            {activeTab === "courses" && (
              <Button onClick={handleCreateCourse}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="hidden">
              <TabsTrigger value="courses">Course Management</TabsTrigger>
              <TabsTrigger value="create">Create/Edit Course</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-0">
              <CourseGrid onEditCourse={handleEditCourse} />
            </TabsContent>

            <TabsContent value="create" className="mt-0">
              {activeTab === "create" && (
                <div>
                  <Button
                    variant="outline"
                    onClick={handleBackToCourses}
                    className="mb-6"
                  >
                    ← Back to Course Management
                  </Button>
                  <CourseForm
                    isEditing={!!editingCourse}
                    courseData={editingCourse}
                    onComplete={handleBackToCourses}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
