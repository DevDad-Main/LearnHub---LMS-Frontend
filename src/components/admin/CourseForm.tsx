import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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

const difficultyLevels = ["beginner", "intermediate", "advanced"];

// Schema for course details only
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

// Schema for individual lecture
const lectureSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Lecture title must be at least 3 characters" }),
  type: z.enum(["video", "text"]),
  content: z.string().optional(),
  videoFile: z.any().optional(),
});

type CourseDetailsValues = z.infer<typeof courseDetailsSchema>;
type LectureValues = z.infer<typeof lectureSchema>;

interface CourseFormProps {
  isEditing?: boolean;
  courseData?: any;
  onComplete?: () => void;
}

const CourseForm = ({
  isEditing = false,
  courseData = null,
  onComplete = () => {},
}: CourseFormProps) => {
  const { axios } = useAppContext();

  // Course details state
  const [courseDetailsSaved, setCourseDetailsSaved] = useState(false);
  const [savedCourseId, setSavedCourseId] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);
  const [courseSubmitError, setCourseSubmitError] = useState<string | null>(
    null,
  );

  // Lectures state
  const [lectures, setLectures] = useState<
    Array<LectureValues & { id: string; saved: boolean }>
  >([]);
  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [currentLecture, setCurrentLecture] = useState<LectureValues | null>(
    null,
  );
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isSubmittingLecture, setIsSubmittingLecture] = useState(false);
  const [lectureSubmitError, setLectureSubmitError] = useState<string | null>(
    null,
  );

  // Course details form
  const courseForm = useForm<CourseDetailsValues>({
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

  // Lecture form
  const lectureForm = useForm<LectureValues>({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      title: "",
      type: "video",
      content: "",
      videoFile: null,
    },
    mode: "onChange",
  });

  const handleCourseDetailsSubmit = async (data: CourseDetailsValues) => {
    setIsSubmittingCourse(true);
    setCourseSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("level", data.level);
      formData.append("price", data.price.toString());

      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }

      const response = await axios.post("/api/v1/course/add-course", formData);

      console.log("Course details saved successfully:", response.data);
      setCourseDetailsSaved(true);
      setSavedCourseId(response.data.courseId || "temp-id");
    } catch (error) {
      console.error("Error saving course details:", error);
      setCourseSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to save course details",
      );
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  const handleLectureSubmit = async (data: LectureValues) => {
    if (!savedCourseId) return;

    setIsSubmittingLecture(true);
    setLectureSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("courseId", savedCourseId);
      formData.append("title", data.title);
      formData.append("type", data.type);
      formData.append("content", data.content || "");

      if (data.type === "video" && data.videoFile) {
        formData.append("videoFile", data.videoFile);
      }

      const response = await axios.post("/api/v1/course/add-lecture", formData);

      console.log("Lecture saved successfully:", response.data);

      // Add lecture to saved lectures list
      const newLecture = {
        ...data,
        id: response.data.lectureId || `lecture-${Date.now()}`,
        saved: true,
      };

      setLectures((prev) => [...prev, newLecture]);
      setIsAddingLecture(false);
      setCurrentLecture(null);
      setVideoPreview(null);
      lectureForm.reset();
    } catch (error) {
      console.error("Error saving lecture:", error);
      setLectureSubmitError(
        error instanceof Error ? error.message : "Failed to save lecture",
      );
    } finally {
      setIsSubmittingLecture(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      courseForm.setValue("thumbnail", file);
    }
  };

  const clearThumbnail = () => {
    setThumbnailPreview(null);
    courseForm.setValue("thumbnail", null);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes("mp4")) {
        alert("Please select an MP4 video file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      lectureForm.setValue("videoFile", file);
    }
  };

  const clearVideo = () => {
    setVideoPreview(null);
    lectureForm.setValue("videoFile", null);
  };

  const startAddingLecture = () => {
    setIsAddingLecture(true);
    setCurrentLecture({
      title: "",
      type: "video",
      content: "",
      videoFile: null,
    });
  };

  const cancelAddingLecture = () => {
    setIsAddingLecture(false);
    setCurrentLecture(null);
    setVideoPreview(null);
    setLectureSubmitError(null);
    lectureForm.reset();
  };

  const canAddMoreLectures = lectures.length < 20;
  const hasUnsavedLecture = isAddingLecture;

  return (
    <div className="bg-background p-6 rounded-lg shadow-sm w-full max-w-5xl mx-auto space-y-8">
      {/* Course Details Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Course Details
              </CardTitle>
              <CardDescription>
                {courseDetailsSaved
                  ? "Course details saved successfully"
                  : "Fill in your course information and save before adding lectures"}
              </CardDescription>
            </div>
            {courseDetailsSaved && (
              <CheckCircle className="h-8 w-8 text-green-500" />
            )}
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
                            disabled={courseDetailsSaved}
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
                            disabled={courseDetailsSaved}
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
                            disabled={courseDetailsSaved}
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
                            disabled={courseDetailsSaved}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {difficultyLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level.charAt(0).toUpperCase() +
                                    level.slice(1)}
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
                            disabled={courseDetailsSaved}
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
                          {!courseDetailsSaved && (
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
                            className={`flex flex-col items-center justify-center w-full h-full ${courseDetailsSaved ? "cursor-not-allowed" : "cursor-pointer"}`}
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
                              disabled={courseDetailsSaved}
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

              {!courseDetailsSaved && (
                <CardFooter className="flex justify-end px-0">
                  <Button type="submit" disabled={isSubmittingCourse}>
                    {isSubmittingCourse ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Course Details...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Course Details
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Lectures Section */}
      {courseDetailsSaved && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">
                  Course Lectures ({lectures.length}/20)
                </CardTitle>
                <CardDescription>
                  Add lectures one at a time. Each lecture must be saved before
                  adding another.
                </CardDescription>
              </div>
              {canAddMoreLectures && !hasUnsavedLecture && (
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      lectureForm.setValue("type", "video");
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
                      lectureForm.setValue("type", "text");
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
            {/* Saved Lectures */}
            {lectures.map((lecture, index) => (
              <Card key={lecture.id} className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">
                          {index + 1}. {lecture.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {lecture.type === "video"
                            ? "Video Lecture"
                            : "Text Lecture"}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600 font-medium">
                      Saved
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Current Lecture Form */}
            {isAddingLecture && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Add New Lecture ({lectures.length + 1}/20)
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

                      {lectureForm.watch("type") === "video" && (
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
                                      Click to upload MP4 video
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
                            Upload an MP4 video file for this lecture
                          </FormDescription>
                        </FormItem>
                      )}

                      {lectureForm.watch("type") === "text" && (
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
                              Saving Lecture...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Lecture
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

      {/* Complete Course Button */}
      {courseDetailsSaved && lectures.length > 0 && !hasUnsavedLecture && (
        <Card>
          <CardFooter className="flex justify-center">
            <Button onClick={onComplete} size="lg">
              Complete Course Creation
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CourseForm;
