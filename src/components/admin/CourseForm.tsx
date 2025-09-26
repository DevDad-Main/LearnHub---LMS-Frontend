import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
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
  ChevronDown,
  ChevronUp,
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
  AlertDialogTrigger,
  AlertDialogTitle,
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
  subtitle: z
    .string()
    .min(5, { message: "Subtitle must be at least 5 characters" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  level: z.string().min(1, { message: "Please select a difficulty level" }),
  price: z.coerce
    .number()
    .min(0, { message: "Price must be a positive number" }),
  requirements: z
    .array(z.string().min(1, { message: "Requirement cannot be empty" }))
    .min(1, { message: "At least one requirement is needed" })
    .max(6, { message: "Maximum of 6 requirements allowed" }),
  learnableSkills: z
    .array(z.string().min(1, { message: "Skill cannot be empty" }))
    .min(1, { message: "At least one learnable skill is needed" })
    .max(6, { message: "Maximum of 6 Learnable Skills allowed" }),
  tags: z
    .array(z.string().min(1, { message: "Tag cannot be empty" }))
    .max(5, { message: "Maximum 5 tags allowed" })
    .optional(),
  languages: z
    .array(z.string().min(1, { message: "Language cannot be empty" }))
    .max(5, { message: "Maximum 5 languages allowed" })
    .optional(),
  thumbnail: z.any().optional(),
});

const sectionSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Section title must be at least 3 characters" }),
});

const lectureSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Lecture title must be at least 3 characters" }),
  type: z.enum(["Video", "Text"]),
  content: z.string().optional(),
  videoFile: z.any().optional(),
});

const CourseForm = () => {
  const { axios } = useAppContext();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const isEditing = !!courseId;

  const [courseDetailsSaved, setCourseDetailsSaved] = useState(isEditing);
  const [savedCourseId, setSavedCourseId] = useState(courseId || null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmittingCourse, setIsSubmittingCourse] = useState(false);
  const [courseSubmitError, setCourseSubmitError] = useState<string | null>(
    null,
  );
  const [isEditingCourseDetails, setIsEditingCourseDetails] =
    useState(!isEditing);
  const [updateThumbnail, setUpdateThumbnail] = useState(false);
  const [updateRequirements, setUpdateRequirements] = useState(false);
  const [updateLearnableSkills, setUpdateLearnableSkills] = useState(false);
  const [updateTags, setUpdateTags] = useState(false);
  const [updateLanguages, setUpdateLanguages] = useState(false);
  const [courseData, setCourseData] = useState<any>(null);

  const [sections, setSections] = useState<any[]>([]);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [isSubmittingSection, setIsSubmittingSection] = useState(false);
  const [sectionSubmitError, setSectionSubmitError] = useState<string | null>(
    null,
  );

  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [updateVideo, setUpdateVideo] = useState(false);
  const [isSubmittingLecture, setIsSubmittingLecture] = useState(false);
  const [lectureSubmitError, setLectureSubmitError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (isEditing && courseId) {
      const fetchCourse = async () => {
        try {
          const response = await axios.get(`/api/v1/course/c/${courseId}`);
          console.log(response);
          const data = response.data.course;
          setCourseData(data);
          setCourseDetailsSaved(true);
          setSavedCourseId(courseId);
          setThumbnailPreview(data.thumbnail);
          if (data.sections) {
            const initializedSections = data.sections.map((section: any) => ({
              id: section._id,
              title: section.title,
              lectures: section.lectures.map((lecture: any) => ({
                id: lecture._id,
                title: lecture.title,
                type: lecture.type,
                content: lecture.content || "",
                videoUrl: lecture.video || "",
                saved: true,
              })),
              saved: true,
            }));
            setSections(initializedSections);
            const initialExpanded = initializedSections.reduce(
              (acc: any, section: any) => ({
                ...acc,
                [section.id]: true,
              }),
              {},
            );
            setExpandedSections(initialExpanded);
          }
        } catch (error) {
          console.error("Error fetching course:", error);
        }
      };
      fetchCourse();
    }
  }, [isEditing, courseId, axios]);

  const courseForm = useForm({
    resolver: zodResolver(courseDetailsSchema),
    defaultValues: {
      title: courseData?.title || "",
      subtitle: courseData?.subtitle || "",
      description: courseData?.description || "",
      category: courseData?.category || "",
      level: courseData?.level || "",
      price: courseData?.price || 0,
      requirements: courseData?.requirements || [],
      learnableSkills: courseData?.learnableSkills || [],
      tags: courseData?.tags || [],
      languages: courseData?.languages || [],
      thumbnail: null,
    },
    mode: "onChange",
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control: courseForm.control,
    name: "requirements",
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: courseForm.control,
    name: "learnableSkills",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: courseForm.control,
    name: "tags",
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control: courseForm.control,
    name: "languages",
  });

  useEffect(() => {
    if (courseData) {
      courseForm.reset({
        title: courseData.title,
        subtitle: courseData.subtitle,
        description: courseData.description,
        category: courseData.category,
        level: courseData.level,
        price: courseData.price,
        requirements: courseData.requirements || [],
        learnableSkills: courseData.learnableSkills || [],
        tags: courseData.tags || [],
        languages: courseData.languages || [],
        thumbnail: null,
      });
      setUpdateThumbnail(false);
      setUpdateRequirements(false);
      setUpdateLearnableSkills(false);
      setUpdateTags(false);
      setUpdateLanguages(false);
    }
  }, [courseData, courseForm]);

  useEffect(() => {
    const subscription = courseForm.watch((value, { name }) => {
      if (name?.startsWith("requirements")) {
        setUpdateRequirements(true);
      }
      if (name?.startsWith("learnableSkills")) {
        setUpdateLearnableSkills(true);
      }
      if (name?.startsWith("tags")) {
        setUpdateTags(true);
      }
      if (name?.startsWith("languages")) {
        setUpdateLanguages(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [courseForm]);

  const sectionForm = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: "",
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

  const handleCourseDetailsSubmit = async (data: any) => {
    setIsSubmittingCourse(true);
    setCourseSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("level", data.level);
      formData.append("price", data.price.toString());
      formData.append("updateThumbnail", updateThumbnail.toString());
      formData.append("updateRequirements", updateRequirements.toString());
      formData.append(
        "updateLearnableSkills",
        updateLearnableSkills.toString(),
      );
      formData.append("updateTags", updateTags.toString());
      formData.append("updateLanguages", updateLanguages.toString());
      if (isEditing) {
        formData.append("currentThumbnail", courseData?.thumbnail || "");
      }
      if (data.thumbnail && updateThumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }
      if (updateRequirements) {
        formData.append("requirements", JSON.stringify(data.requirements));
      }
      if (updateLearnableSkills) {
        formData.append(
          "learnableSkills",
          JSON.stringify(data.learnableSkills),
        );
      }
      if (updateTags) {
        formData.append("tags", JSON.stringify(data.tags || []));
      }
      if (updateLanguages) {
        formData.append("languages", JSON.stringify(data.languages || []));
      }

      const endpoint = isEditing
        ? `/api/v1/course/c/${savedCourseId}`
        : "/api/v1/course/add-course";
      const method = isEditing ? "put" : "post";
      const response = await axios[method](endpoint, formData);

      console.log("Course details saved successfully:", response.data);
      setCourseDetailsSaved(true);
      setIsEditingCourseDetails(false);
      setUpdateThumbnail(false);
      setUpdateRequirements(false);
      setUpdateLearnableSkills(false);
      setUpdateTags(false);
      setUpdateLanguages(false);

      if (!savedCourseId) {
        setSavedCourseId(response.data.courseId);
      }
    } catch (error: any) {
      console.error("Error saving course details:", error);
      setCourseSubmitError(
        error.response?.data?.message || "Failed to save course details",
      );
    } finally {
      setIsSubmittingCourse(false);
    }
  };

  const handleSectionSubmit = async (data: any) => {
    if (!savedCourseId) {
      setSectionSubmitError("No course ID available");
      return;
    }

    setIsSubmittingSection(true);
    setSectionSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("title", data.title);

      let response;
      if (editingSectionId) {
        response = await axios.put(
          `/api/v1/course/${savedCourseId}/update-section/${editingSectionId}`,
          formData,
        );
        setSections((prev) =>
          prev.map((section) =>
            section.id === editingSectionId
              ? { ...section, title: data.title, saved: true }
              : section,
          ),
        );
      } else {
        response = await axios.post(
          `/api/v1/course/${savedCourseId}/add-section`,
          formData,
        );
        const newSection = {
          id: response.data.sectionId,
          title: data.title,
          lectures: [],
          saved: true,
        };
        setSections((prev) => [...prev, newSection]);
        setExpandedSections((prev) => ({ ...prev, [newSection.id]: true }));
      }

      console.log("Section saved successfully:", response.data);
      setIsAddingSection(false);
      setEditingSectionId(null);
      sectionForm.reset();
    } catch (error: any) {
      console.error("Error saving section:", error);
      setSectionSubmitError(
        error.response?.data?.message || "Failed to save section",
      );
    } finally {
      setIsSubmittingSection(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await axios.delete(
        `/api/v1/course/${savedCourseId}/delete-section/${sectionId}`,
      );
      setSections((prev) => prev.filter((section) => section.id !== sectionId));
      setExpandedSections((prev) => {
        const updated = { ...prev };
        delete updated[sectionId];
        return updated;
      });
      console.log("Section deleted successfully");
    } catch (error: any) {
      console.error("Error deleting section:", error);
      setSectionSubmitError(
        error.response?.data?.message || "Failed to delete section",
      );
    }
  };

  const startEditingSection = (section: any) => {
    setEditingSectionId(section.id);
    setIsAddingSection(true);
    sectionForm.reset({ title: section.title });
  };

  const startAddingSection = () => {
    setIsAddingSection(true);
    setEditingSectionId(null);
    sectionForm.reset({ title: "" });
  };

  const cancelAddingSection = () => {
    setIsAddingSection(false);
    setEditingSectionId(null);
    setSectionSubmitError(null);
    sectionForm.reset();
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleLectureSubmit = async (data: any) => {
    if (!savedCourseId || !currentSectionId) {
      setLectureSubmitError("No course or section ID available");
      return;
    }

    setIsSubmittingLecture(true);
    setLectureSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("type", data.type);
      formData.append("content", data.content || "");
      formData.append("updateVideo", updateVideo.toString());
      if (editingLectureId) {
        formData.append("currentVideo", data.videoUrl || "");
      }
      if (data.type === "Video" && data.videoFile && updateVideo) {
        formData.append("videoFile", data.videoFile);
      }
      let response;
      if (editingLectureId) {
        response = await axios.put(
          `/api/v1/course/${savedCourseId}/update-lecture/${editingLectureId}`,
          formData,
        );
        setSections((prevSections) =>
          prevSections.map((section) =>
            section.id === currentSectionId
              ? {
                  ...section,
                  lectures: section.lectures.map((lecture) =>
                    lecture.id === editingLectureId
                      ? {
                          ...data,
                          id: editingLectureId,
                          saved: true,
                          videoUrl: response.data.lecture.video,
                        }
                      : lecture,
                  ),
                }
              : section,
          ),
        );
      } else {
        response = await axios.post(
          `/api/v1/course/${savedCourseId}/section/${currentSectionId}/add-lecture`,
          formData,
        );
        const newLecture = {
          ...data,
          id: response.data.lectureId,
          saved: true,
          videoUrl: response.data.lecture?.video || "",
        };
        setSections((prevSections) =>
          prevSections.map((section) =>
            section.id === currentSectionId
              ? {
                  ...section,
                  lectures: [...section.lectures, newLecture],
                }
              : section,
          ),
        );
      }

      console.log("Lecture saved successfully:", response.data);
      setIsAddingLecture(false);
      setEditingLectureId(null);
      setCurrentSectionId(null);
      setVideoPreview(null);
      setUpdateVideo(false);
      lectureForm.reset();
    } catch (error: any) {
      console.error("Error saving lecture:", error);
      setLectureSubmitError(
        error.response?.data?.message || "Failed to save lecture",
      );
    } finally {
      setIsSubmittingLecture(false);
    }
  };

  const handleDeleteLecture = async (sectionId: string, lectureId: string) => {
    try {
      await axios.delete(
        `/api/v1/course/${savedCourseId}/delete-lecture/${lectureId}`,
      );
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                lectures: section.lectures.filter(
                  (lecture) => lecture.id !== lectureId,
                ),
              }
            : section,
        ),
      );
      console.log("Lecture deleted successfully");
    } catch (error: any) {
      console.error("Error deleting lecture:", error);
      setLectureSubmitError(
        error.response?.data?.message || "Failed to delete lecture",
      );
    }
  };

  const startEditingLecture = (sectionId: string, lecture: any) => {
    setCurrentSectionId(sectionId);
    setEditingLectureId(lecture.id);
    setIsAddingLecture(true);
    setVideoPreview(lecture.videoUrl || null);
    setUpdateVideo(false);
    lectureForm.reset({
      title: lecture.title,
      type: lecture.type,
      content: lecture.content || "",
      videoFile: null,
    });
  };

  const startAddingLectureToSection = (sectionId: string) => {
    setCurrentSectionId(sectionId);
    setIsAddingLecture(true);
    setEditingLectureId(null);
    setVideoPreview(null);
    setUpdateVideo(false);
    lectureForm.reset({
      title: "",
      type: "Video",
      content: "",
      videoFile: null,
    });
  };

  const cancelAddingLecture = () => {
    setIsAddingLecture(false);
    setEditingLectureId(null);
    setCurrentSectionId(null);
    setVideoPreview(null);
    setUpdateVideo(false);
    setLectureSubmitError(null);
    lectureForm.reset();
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
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
      setUpdateVideo(true);
    }
  };

  const clearVideo = () => {
    setVideoPreview(null);
    lectureForm.setValue("videoFile", null);
    setUpdateVideo(true);
  };

  const canAddMoreSections = sections.length < 20;

  return (
    <div className="bg-background p-6 rounded-lg shadow-sm w-full max-w-5xl mx-auto space-y-8">
      <Button
        variant="outline"
        onClick={() => navigate("/instructor/courses")}
        className="mb-6"
      >
        ← Back to Course Management
      </Button>

      {/* Course Details Section */}
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
                    : "Fill in your course information and save before adding sections"}
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
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Subtitle</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter course subtitle"
                            {...field}
                            disabled={
                              courseDetailsSaved && !isEditingCourseDetails
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          A subtitle to display under the title
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
                  <FormItem>
                    <FormLabel>Requirements</FormLabel>
                    <div className="space-y-2">
                      {requirementFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <Input
                              placeholder="Enter requirement"
                              {...courseForm.register(`requirements.${index}`)}
                              disabled={
                                courseDetailsSaved && !isEditingCourseDetails
                              }
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              removeRequirement(index);
                              setUpdateRequirements(true);
                            }}
                            disabled={
                              courseDetailsSaved && !isEditingCourseDetails
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        appendRequirement("");
                        setUpdateRequirements(true);
                      }}
                      className="mt-2"
                      disabled={courseDetailsSaved && !isEditingCourseDetails}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Requirement
                    </Button>
                    <FormMessage>
                      {courseForm.formState.errors.requirements?.message}
                    </FormMessage>
                  </FormItem>
                  <FormItem>
                    <FormLabel>Learnable Skills</FormLabel>
                    <div className="space-y-2">
                      {skillFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <Input
                              placeholder="Enter learnable skill"
                              {...courseForm.register(
                                `learnableSkills.${index}`,
                              )}
                              disabled={
                                courseDetailsSaved && !isEditingCourseDetails
                              }
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              removeSkill(index);
                              setUpdateLearnableSkills(true);
                            }}
                            disabled={
                              courseDetailsSaved && !isEditingCourseDetails
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        appendSkill("");
                        setUpdateLearnableSkills(true);
                      }}
                      className="mt-2"
                      disabled={courseDetailsSaved && !isEditingCourseDetails}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Skill
                    </Button>
                    <FormMessage>
                      {courseForm.formState.errors.learnableSkills?.message}
                    </FormMessage>
                  </FormItem>
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="space-y-2">
                      {tagFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <Input
                              placeholder="Enter tag"
                              {...courseForm.register(`tags.${index}`)}
                              disabled={
                                courseDetailsSaved && !isEditingCourseDetails
                              }
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              removeTag(index);
                              setUpdateTags(true);
                            }}
                            disabled={
                              courseDetailsSaved && !isEditingCourseDetails
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (tagFields.length < 5) {
                          appendTag("");
                          setUpdateTags(true);
                        }
                      }}
                      className="mt-2"
                      disabled={
                        (courseDetailsSaved && !isEditingCourseDetails) ||
                        tagFields.length >= 5
                      }
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Tag
                    </Button>
                    <FormDescription>
                      Add up to 5 tags to categorize your course
                    </FormDescription>
                    <FormMessage>
                      {courseForm.formState.errors.tags?.message}
                    </FormMessage>
                  </FormItem>
                  <FormItem>
                    <FormLabel>Languages</FormLabel>
                    <div className="space-y-2">
                      {languageFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <Input
                              placeholder="Enter language"
                              {...courseForm.register(`languages.${index}`)}
                              disabled={
                                courseDetailsSaved && !isEditingCourseDetails
                              }
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              removeLanguage(index);
                              setUpdateLanguages(true);
                            }}
                            disabled={
                              courseDetailsSaved && !isEditingCourseDetails
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (languageFields.length < 5) {
                          appendLanguage("");
                          setUpdateLanguages(true);
                        }
                      }}
                      className="mt-2"
                      disabled={
                        (courseDetailsSaved && !isEditingCourseDetails) ||
                        languageFields.length >= 5
                      }
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Language
                    </Button>
                    <FormDescription>
                      Add up to 5 languages available in the course
                    </FormDescription>
                    <FormMessage>
                      {courseForm.formState.errors.languages?.message}
                    </FormMessage>
                  </FormItem>
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
                                <SelectItem key={level} value={level}>
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
                        setUpdateRequirements(false);
                        setUpdateLearnableSkills(false);
                        setUpdateTags(false);
                        setUpdateLanguages(false);
                        setThumbnailPreview(courseData?.thumbnail || null);
                        courseForm.reset({
                          title: courseData?.title || "",
                          subtitle: courseData?.subtitle || "",
                          description: courseData?.description || "",
                          category: courseData?.category || "",
                          level: courseData?.level || "",
                          price: courseData?.price || 0,
                          requirements: courseData?.requirements || [],
                          learnableSkills: courseData?.learnableSkills || [],
                          tags: courseData?.tags || [],
                          languages: courseData?.languages || [],
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

      {/* Sections Section */}
      {courseDetailsSaved && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">
                  Course Sections ({sections.length}/20)
                </CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Manage your course sections. Add sections and lectures one at a time."
                    : "Add sections one at a time. Each section must be saved before adding lectures."}
                </CardDescription>
              </div>
              {canAddMoreSections && !isAddingSection && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={startAddingSection}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              )}
            </div>
            {sectionSubmitError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                Error: {sectionSubmitError}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isAddingSection && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingSectionId ? "Edit Section" : "Add New Section"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...sectionForm}>
                    <form
                      onSubmit={sectionForm.handleSubmit(handleSectionSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={sectionForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter section title"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelAddingSection}
                          disabled={isSubmittingSection}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmittingSection}>
                          {isSubmittingSection ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {editingSectionId
                                ? "Updating..."
                                : "Saving Section..."}
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              {editingSectionId
                                ? "Update Section"
                                : "Save Section"}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {sections.map((section, index) => (
              <Card key={section.id}>
                <CardHeader
                  className="cursor-pointer flex flex-row items-center justify-between"
                  onClick={() => toggleSection(section.id)}
                >
                  <div>
                    <CardTitle className="text-lg">
                      Section {index + 1}: {section.title}
                    </CardTitle>
                    <CardDescription>
                      Lectures: {section.lectures.length}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingSection(section);
                      }}
                      disabled={isAddingSection || isAddingLecture}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          disabled={isAddingSection || isAddingLecture}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Section</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{section.title}"?
                            This will also delete all lectures in this section.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteSection(section.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    {expandedSections[section.id] ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </CardHeader>
                {expandedSections[section.id] && (
                  <CardContent className="space-y-4">
                    {section.lectures.map((lecture: any, lecIndex: number) => (
                      <Card
                        key={lecture.id}
                        className="bg-green-50 border-green-200"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Video className="h-5 w-5 text-green-500" />
                              <div>
                                <h4 className="font-medium">
                                  {lecIndex + 1}. {lecture.title}
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
                                onClick={() =>
                                  startEditingLecture(section.id, lecture)
                                }
                                disabled={isAddingLecture}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isAddingLecture}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Lecture
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "
                                      {lecture.title}"? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteLecture(
                                          section.id,
                                          lecture.id,
                                        )
                                      }
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
                    {section.lectures.length < 30 && !isAddingLecture && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => startAddingLectureToSection(section.id)}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Lecture to this Section
                      </Button>
                    )}
                    {section.lectures.length === 0 && (
                      <p className="text-center text-muted-foreground">
                        No lectures in this section yet.
                      </p>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
            {sections.length === 0 && !isAddingSection && (
              <div className="text-center p-8 border border-dashed rounded-md">
                <p className="text-muted-foreground mb-4">
                  No sections added yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Add a section to start organizing your lectures
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lecture Form */}
      {isAddingLecture && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingLectureId ? "Edit Lecture" : "Add New Lecture"}
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
                        <Input placeholder="Enter lecture title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        {editingLectureId ? "Updating..." : "Saving Lecture..."}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {editingLectureId ? "Update Lecture" : "Save Lecture"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      {courseDetailsSaved &&
        sections.length > 0 &&
        !isAddingSection &&
        !isAddingLecture && (
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate("/instructor/courses")} size="lg">
              {isEditing ? "Save Changes" : "Complete Course Creation"}
            </Button>
          </CardFooter>
        )}
    </div>
  );
};

export default CourseForm;
