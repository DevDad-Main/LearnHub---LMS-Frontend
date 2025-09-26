import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Briefcase,
  FileText,
  Camera,
  Save,
  Loader2,
  Upload,
  X,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  FormDescription,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "../../context/AppContext";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  profession: z.string().min(2, { message: "Please enter your profession" }),
  bio: z.string().min(50, { message: "Bio must be at least 50 characters" }),
  avatar: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const InstructorProfile = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [updateAvatar, setUpdateAvatar] = useState(false);
  const [expertise, setExpertise] = useState<string[]>([]);
  const [newExpertise, setNewExpertise] = useState("");
  const [instructorData, setInstructorData] = useState<any>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      profession: "",
      bio: "",
      avatar: null,
    },
  });

  useEffect(() => {
    const fetchInstructorProfile = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get("/api/v1/instructor/profile");
        const data = response.data.instructor;

        setInstructorData(data);
        setAvatarPreview(data.avatar);
        setExpertise(data.expertise || []);

        form.reset({
          name: data.name || "",
          email: data.email || "",
          profession: data.profession || "",
          bio: data.bio || "",
          avatar: null,
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchInstructorProfile();
  }, [axios, form, toast]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select an image file",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setUpdateAvatar(true);
      };
      reader.readAsDataURL(file);
      form.setValue("avatar", file);
    }
  };

  const clearAvatar = () => {
    setAvatarPreview(instructorData?.avatar || null);
    setUpdateAvatar(false);
    form.setValue("avatar", null);
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !expertise.includes(newExpertise.trim())) {
      setExpertise([...expertise, newExpertise.trim()]);
      setNewExpertise("");
    }
  };

  const removeExpertise = (index: number) => {
    setExpertise(expertise.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("profession", data.profession);
      formData.append("bio", data.bio);
      formData.append("expertise", JSON.stringify(expertise));
      formData.append("updateAvatar", updateAvatar.toString());

      if (data.avatar && updateAvatar) {
        formData.append("avatar", data.avatar);
      }

      const response = await axios.put("/api/v1/instructor/profile", formData);

      if (response.data.success) {
        toast({
          title: "Profile updated!",
          description: "Your profile has been successfully updated.",
        });
        setUpdateAvatar(false);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate("/instructor/courses")}
          className="mb-4"
        >
          ← Back to Course Management
        </Button>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Instructor Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your profile information and expertise
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  {avatarPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={avatarPreview}
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg mx-auto"
                      />
                      {updateAvatar && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                          onClick={clearAvatar}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  <div>
                    <label className="cursor-pointer">
                      <div className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>Change Picture</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expertise Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Areas of Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add expertise"
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addExpertise()}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={addExpertise}
                      disabled={!newExpertise.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {expertise.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <span>{skill}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeExpertise(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>

                  {expertise.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No expertise added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Edit className="mr-2 h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal and professional information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
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
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Mail className="mr-2 h-4 w-4" />
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="instructor@example.com"
                                {...field}
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Briefcase className="mr-2 h-4 w-4" />
                            Profession/Job Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Senior Software Engineer, Data Scientist"
                              {...field}
                              className="h-11"
                            />
                          </FormControl>
                          <FormDescription>
                            Your current job title or professional role
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            Professional Bio
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your background, experience, and what makes you a great instructor..."
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Describe your professional background and teaching
                            experience (minimum 50 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/instructor/dashboard")}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="min-w-32"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
