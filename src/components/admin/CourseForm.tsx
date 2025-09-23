import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  PlusCircle,
  Trash2,
  Upload,
  X,
  Loader2,
  Video,
  CheckCircle,
  Save,
  Edit,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppContext } from "../../context/AppContext";

const courseCategories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Business",
  "Marketing",
  "Design",
  "Photography",
];

const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

const courseDetailsSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  level: z.string().min(1, { message: "Please select a difficulty level" }),
  price: z.coerce
    .number()
    .min(0, { message: "Price must be a positive number" }),
  thumbnail: z.any().optional(),
});

const lectureSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Lecture title must be at least 3 characters" }),
  type: z.enum(["Video", "Text"]),
  content: z.string().optional(),
  videoFile: z.any().optional(),
});

const CourseForm = ({
  isEditing = false,
  courseData = null,
  onComplete = () => {},
}) => {
  const { axios } = useAppContext();

  const [courseDetailsSaved, setCourseDetailsSaved] = useState(isEditing);
  const [savedCourseId, setSavedCourseId] = useState(courseData?._id || null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    courseData?.thumbnail || null,
  );
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);
  const [courseSubmitError, setCourseSubmitError] = useState(null);
  const [isEditingCourseDetails, setIsEditingCourseDetails] =
    useState(!isEditing);
  const [updateThumbnail, setUpdateThumbnail] = useState(false);
  const [lectures, setLectures] = useState([]);
  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [editingLectureId, setEditingLectureId] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isSubmittingLecture, setIsSubmittingLecture] = useState(false);
  const [lectureSubmitError, setLectureSubmitError] = useState(null);

  useEffect(() => {
    if (isEditing && courseData) {
      setCourseDetailsSaved(true);
      setSavedCourseId(courseData._id);
      setThumbnailPreview(courseData.thumbnail);
      if (courseData.lectures) {
        setLectures(
          courseData.lectures.map((lecture) => ({
            ...lecture,
            saved: true,
          })),
        );
      }
    }
  }, [isEditing, courseData]);

  const courseForm = useForm({
    resolver: zodResolver(courseDetailsSchema),
    defaultValues: {
      title: courseData?.title || "",
      description: courseData?.description || "",
      category: courseData?.category || "",
      level: courseData?.level || "",
      price: courseData?.price || 0,
      thumbnail: null,
    },
    mode: "onChange",
  });

  const lectureForm = useForm({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      title: "",
      type: "Video",
      content: "",
      videoFile: null,
    },
    mode: "onChange",
  });

  const handleCourseDetailsSubmit = async (data) => {
    setIsSubmittingCourse(true);
    setCourseSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("level", data.level);
      formData.append("price", data.price.toString());
      formData.append("updateThumbnail", updateThumbnail.toString());
      if (isEditing) {
        formData.append("currentThumbnail", courseData?.thumbnail || "");
      }
      if (data.thumbnail && updateThumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }

      const endpoint =
        isEditing && savedCourseId
          ? `/api/v1/course/c/${savedCourseId}`
          : "/api/v1/course/add-course";
      const method = isEditing && savedCourseId ? "put" : "post";
      const response = await axios[method](endpoint, formData);

      console.log("Course details saved successfully:", response.data);
      setCourseDetailsSaved(true);
      setIsEditingCourseDetails(false);
      setUpdateThumbnail(false);

      if (!savedCourseId) {
        setSavedCourseId(response.data.course._id);
      }
    } catch (error) {
      console.error("Error saving course details:", error);
      setCourseSubmitError(
        error.response?.data?.message || "Failed to save course details",
      );
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  const handleLectureSubmit = async (data) => {
    if (!savedCourseId) {
      setLectureSubmitError("No course ID available");
      return;
    }

    setIsSubmittingLecture(true);
    setLectureSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("courseId", savedCourseId);
      formData.append("title", data.title);
      formData.append("type", data.type);
      formData.append("content", data.content || "");
      if (data.type === "Video" && data.videoFile) {
        formData.append("videoFile", data.videoFile);
      }

      console.log("Submitting lecture:", {
        editingLectureId,
        formData: [...formData],
      });

      let response;
      if (editingLectureId) {
        // Update existing lecture
        response = await axios.put(
          `/api/v1/course/update-lecture/${editingLectureId}`,
          formData,
        );
        setLectures((prev) =>
          prev.map((lecture) =>
            lecture.id === editingLectureId
              ? {
                  ...data,
                  id: editingLectureId,
                  saved: true,
                  videoUrl: response.data.lecture.video,
                }
              : lecture,
          ),
        );
      } else {
        // Add new lecture
        response = await axios.post(`/api/v1/course/add-lecture`, formData);
        const newLecture = {
          ...data,
          id: response.data.lectureId,
          saved: true,
          videoUrl: response.data.lecture?.videoUrl || "",
        };
        setLectures((prev) => [...prev, newLecture]);
      }

      console.log("Lecture saved successfully:", response.data);
      setIsAddingLecture(false);
      setEditingLectureId(null);
      setCurrentLecture(null);
      setVideoPreview(null);
      lectureForm.reset();
    } catch (error) {
      console.error("Error saving lecture:", error);
      setLectureSubmitError(
        error.response?.data?.message || "Failed to save lecture",
      );
    } finally {
      setIsSubmittingLecture(false);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    try {
      await axios.delete(`/api/v1/course/delete-lecture/${lectureId}`);
      setLectures((prev) => prev.filter((lecture) => lecture.id !== lectureId));
      console.log("Lecture deleted successfully");
    } catch (error) {
      console.error("Error deleting lecture:", error);
      setLectureSubmitError(
        error.response?.data?.message || "Failed to delete lecture",
      );
    }
  };

  const startEditingLecture = (lecture) => {
    setEditingLectureId(lecture.id);
    setIsAddingLecture(true);
    setVideoPreview(lecture.videoUrl || null);
    lectureForm.reset({
      title: lecture.title,
      type: lecture.type,
      content: lecture.content || "",
      videoFile: null,
    });
  };

  const startAddingLecture = () => {
    setIsAddingLecture(true);
    setEditingLectureId(null); // Ensure no lecture ID is set for new lectures
    setVideoPreview(null);
    setCurrentLecture(null);
    lectureForm.reset({
      title: "",
      type: "Video",
      content: "",
      videoFile: null,
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        setUpdateThumbnail(true);
      };
      reader.readAsDataURL(file);
      courseForm.setValue("thumbnail", file);
    }
  };

  const clearThumbnail = () => {
    setThumbnailPreview(null);
    setUpdateThumbnail(true);
    courseForm.setValue("thumbnail", null);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes("mp4")) {
        alert("Please select an MP4 video file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      lectureForm.setValue("videoFile", file);
    }
  };

  const clearVideo = () => {
    setVideoPreview(null);
    lectureForm.setValue("videoFile", null);
  };

  const cancelAddingLecture = () => {
    setIsAddingLecture(false);
    setEditingLectureId(null);
    setCurrentLecture(null);
    setVideoPreview(null);
    setLectureSubmitError(null);
    lectureForm.reset();
  };

  const canAddMoreLectures = lectures.length < 20;
  const hasUnsavedLecture = isAddingLecture;

  return (
    <div className="bg-background p-6 rounded-lg shadow-sm w-full max-w-5xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Course Details
              </CardTitle>
              <CardDescription>
                {isEditing
                  ? "Edit your course information"
                  : courseDetailsSaved
                    ? "Course details saved successfully"
                    : "Fill in your course information and save before adding lectures"}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {courseDetailsSaved && !isEditingCourseDetails && (
                <CheckCircle className="h-8 w-8 text-green-500" />
              )}
              {isEditing && courseDetailsSaved && !isEditingCourseDetails && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingCourseDetails(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Details
                </Button>
              )}
            </div>
          </div>
          {courseSubmitError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
              Error: {courseSubmitError}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...courseForm}>
            <form
              onSubmit={courseForm.handleSubmit(handleCourseDetailsSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={courseForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter course title"
                            {...field}
                            disabled={
                              courseDetailsSaved && !isEditingCourseDetails
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          A catchy title for your course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={courseForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what students will learn"
                            className="min-h-32"
                            {...field}
                            disabled={
                              courseDetailsSaved && !isEditingCourseDetails
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed description of your course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={courseForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={
                              courseDetailsSaved && !isEditingCourseDetails
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {courseCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={courseForm.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={
                              courseDetailsSaved && !isEditingCourseDetails
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {difficultyLevels.map((level) => (
                                <SelectItem
                                  key={level}
                                  value={level.toLowerCase()}
                                >
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={courseForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            disabled={
                              courseDetailsSaved && !isEditingCourseDetails
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Course Thumbnail</FormLabel>
                    <div className="mt-2">
                      {thumbnailPreview ? (
                        <div className="relative w-full h-40 rounded-md overflow-hidden">
                          <img
                            src={thumbnailPreview}
                            alt="Course thumbnail preview"
                            className="w-full h-full object-cover"
                          />
                          {(isEditingCourseDetails || !courseDetailsSaved) && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8 rounded-full"
                              onClick={clearThumbnail}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md">
                          <label
                            className={`flex flex-col items-center justify-center w-full h-full ${
                              courseDetailsSaved && !isEditingCourseDetails
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="h-10 w-10 text-gray-400" />
                              <p className="mt-2 text-sm text-gray-500">
                                Click to upload thumbnail
                              </p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleThumbnailChange}
                              disabled={
                                courseDetailsSaved && !isEditingCourseDetails
                              }
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      Upload a compelling image for your course (16:9 ratio
                      recommended)
                    </FormDescription>
                  </FormItem>
                </div>
              </div>
              {(isEditingCourseDetails || !courseDetailsSaved) && (
                <CardFooter className="flex justify-end px-0">
                  {isEditingCourseDetails && (
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-2"
                      onClick={() => {
                        setIsEditingCourseDetails(false);
                        setUpdateThumbnail(false);
                        setThumbnailPreview(courseData?.thumbnail || null);
                        courseForm.reset({
                          title: courseData?.title || "",
                          description: courseData?.description || "",
                          category: courseData?.category || "",
                          level: courseData?.level || "",
                          price: courseData?.price || 0,
                          thumbnail: null,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" disabled={isSubmittingCourse}>
                    {isSubmittingCourse ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditing ? "Updating..." : "Saving Course Details..."}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isEditing
                          ? "Update Course Details"
                          : "Save Course Details"}
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
      {courseDetailsSaved && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">
                  Course Lectures ({lectures.length}/20)
                </CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Manage your course lectures. You can add, edit, or remove lectures."
                    : "Add lectures one at a time. Each lecture must be saved before adding another."}
                </CardDescription>
              </div>
              {canAddMoreLectures && !hasUnsavedLecture && (
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      lectureForm.setValue("type", "Video");
                      startAddingLecture();
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Video
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      lectureForm.setValue("type", "Text");
                      startAddingLecture();
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Text
                  </Button>
                </div>
              )}
            </div>
            {!canAddMoreLectures && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
                Maximum of 20 lectures reached
              </div>
            )}
            {lectureSubmitError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                Error: {lectureSubmitError}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {lectures.map((lecture, index) => (
              <Card key={lecture.id} className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {lecture.type === "Video" ? (
                        <Video className="h-5 w-5 text-green-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <h4 className="font-medium">
                          {index + 1}. {lecture.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Video Lecture
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditingLecture(lecture)}
                        disabled={hasUnsavedLecture}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={hasUnsavedLecture}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Lecture</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{lecture.title}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteLecture(lecture.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {isAddingLecture && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingLectureId
                      ? "Edit Lecture"
                      : `Add New Lecture (${lectures.length + 1}/20)`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...lectureForm}>
                    <form
                      onSubmit={lectureForm.handleSubmit(handleLectureSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={lectureForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lecture Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter lecture title"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {lectureForm.watch("type") === "Video" && (
                        <FormItem>
                          <FormLabel>Video File</FormLabel>
                          <div className="mt-2">
                            {videoPreview ? (
                              <div className="relative w-full h-40 rounded-md overflow-hidden bg-black">
                                <video
                                  src={videoPreview}
                                  className="w-full h-full object-contain"
                                  controls
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                  onClick={clearVideo}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md">
                                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Video className="h-10 w-10 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-500">
                                      {editingLectureId
                                        ? "Click to change video"
                                        : "Click to upload MP4 video"}
                                    </p>
                                  </div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept=".mp4,video/mp4"
                                    onChange={handleVideoChange}
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                          <FormDescription>
                            {editingLectureId
                              ? "Upload a new MP4 video file to replace the current one (optional)"
                              : "Upload an MP4 video file for this lecture"}
                          </FormDescription>
                        </FormItem>
                      )}
                      {lectureForm.watch("type") === "Text" && (
                        <FormField
                          control={lectureForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lecture Content</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter lecture content"
                                  className="min-h-24"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelAddingLecture}
                          disabled={isSubmittingLecture}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmittingLecture}>
                          {isSubmittingLecture ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {editingLectureId
                                ? "Updating..."
                                : "Saving Lecture..."}
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              {editingLectureId
                                ? "Update Lecture"
                                : "Save Lecture"}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
            {lectures.length === 0 && !isAddingLecture && (
              <div className="text-center p-8 border border-dashed rounded-md">
                <p className="text-muted-foreground mb-4">
                  No lectures added yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Click "Add Video" or "Add Text" to create your first lecture
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {courseDetailsSaved && lectures.length > 0 && !hasUnsavedLecture && (
        <Card>
          <CardFooter className="flex justify-center">
            <Button onClick={onComplete} size="lg">
              {isEditing ? "Save Changes" : "Complete Course Creation"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CourseForm;
