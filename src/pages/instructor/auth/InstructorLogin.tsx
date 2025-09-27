import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleLogin } from "@react-oauth/google";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "../../../context/AppContext";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const InstructorLogin = () => {
  const { axios, setInstructor } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Form Data:", data); // Debug form data
    console.log("Axios instance:", axios); // Debug axios instance
    setIsLoading(true);
    try {
      const response = await axios.post("/api/v1/instructor/login", data);
      if (response.data.success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        setInstructor(response.data.instructor); // Assuming backend returns instructor data
        navigate("/instructor/dashboard");
      } else {
        console.log("Login failed:", response.data.message);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: response.data.message || "Invalid credentials",
        });
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
      form.reset({ email: "", password: "" }); // Reset form
    }
  };

  const responseMessage = async (response) => {
    try {
      if (!response?.credential) {
        throw new Error("No credential received from Google");
      }

      const { data } = await axios.post("/api/v1/instructor/google-login", {
        credential: response.credential,
      });

      if (data.success) {
        toast({
          title: "Login Successful!",
          description: "Instructor Successfully Logged In",
        });
        console.log("Google Login Data:", data);
        setInstructor(data.instructor);
        navigate("/instructor/dashboard");
      } else {
        console.log("Google Login failed:", data.message);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: data.message || "Google login failed",
        });
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log in with Google. Please try again.",
      });
    }
  };

  const errorMessage = (error) => {
    console.error("Google Login Error:", error);
    toast({
      variant: "destructive",
      title: "Google Login Failed",
      description: "An error occurred during Google login. Please try again.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Instructor Portal
          </h1>
          <p className="text-gray-600 mt-2">Sign in to manage your courses</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your instructor account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="instructor@example.com"
                          id="email"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            id="password"
                            {...field}
                            className="h-11 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <Link
                    to="/instructor/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="mt-4">
                  <GoogleLogin
                    onSuccess={responseMessage}
                    onError={errorMessage}
                    scope="email profile"
                  />
                </div>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an instructor account?{" "}
                <Link
                  to="/instructor/register"
                  className="text-primary font-medium hover:underline"
                >
                  Apply to become an instructor
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to main site
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstructorLogin;
