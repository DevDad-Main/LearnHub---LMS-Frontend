import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  BarChart3,
  DollarSign,
  User,
  Settings,
  Bell,
  PlusCircle,
} from "lucide-react";
import CourseGrid from "./CourseGrid";
import { useAppContext } from "../../context/AppContext";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const { axios, fetchCourses, courses } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = () => {
    navigate("/admin/course/create");
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
            onClick={() => {
              setActiveTab("courses");
              navigate("/admin/courses");
            }}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Course Management
          </Button>
          <Button
            variant={activeTab === "analytics" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            Analytics
          </Button>
          <Button
            variant={activeTab === "revenue" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("revenue")}
          >
            <DollarSign className="h-5 w-5 mr-2" />
            Revenue
          </Button>
          <Button
            variant={activeTab === "users" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("users")}
          >
            <User className="h-5 w-5 mr-2" />
            User Management
          </Button>
          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("settings")}
          >
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
          <h1 className="text-xl font-semibold">Course Management</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell size={20} />
            </Button>
            <Button onClick={handleCreateCourse}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <CourseGrid courses={courses} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
