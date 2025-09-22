import React, { useState, useMemo } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  PlusCircle,
  Trash2,
  MoveUp,
  MoveDown,
  Upload,
  X,
  Loader2,
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppContext } from "../../context/AppContext.jsx";

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

const formSchema = z.object({
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
  sections: z.array(
    z.object({
      title: z
        .string()
        .min(3, { message: "Section title must be at least 3 characters" }),
      description: z.string().optional(),
      lectures: z.array(
        z.object({
          title: z
            .string()
            .min(3, { message: "Lecture title must be at least 3 characters" }),
          type: z.enum(["video", "text", "quiz"]),
          content: z.string().optional(),
          videoUrl: z.string().optional(),
        }),
      ),
    }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
  initialData?: FormValues;
  onSubmit?: (data: FormValues) => void;
  apiEndpoint?: string;
}

// Separate component for section content to avoid hooks in map
const SectionContent = ({
  sectionIndex,
  form,
  section,
}: {
  sectionIndex: number;
  form: any;
  section: any;
}) => {
  const {
    fields: lectureFields,
    append: appendLecture,
    remove: removeLecture,
  } = useFieldArray({
    control: form.control,
    name: `sections.${sectionIndex}.lectures`,
  });

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-md">
      <FormField
        control={form.control}
        name={`sections.${sectionIndex}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Section Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter section title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`sections.${sectionIndex}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Section Description (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief overview of this section"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium">Lectures</h4>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendLecture({
                  title: "",
                  type: "video",
                  content: "",
                  videoUrl: "",
                })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Video
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendLecture({
                  title: "",
                  type: "text",
                  content: "",
                })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Text
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendLecture({
                  title: "",
                  type: "quiz",
                  content: "",
                })
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Quiz
            </Button>
          </div>
        </div>

        {lectureFields.length === 0 ? (
          <div className="text-center p-4 border border-dashed rounded-md">
            <p className="text-muted-foreground">No lectures added yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lectureFields.map((lecture, lectureIndex) => (
              <Card key={lecture.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {lectureIndex + 1}.
                      </span>
                      <Controller
                        control={form.control}
                        name={`sections.${sectionIndex}.lectures.${lectureIndex}.title`}
                        render={({ field }) => (
                          <Input
                            placeholder="Lecture title"
                            className="h-8 text-sm"
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className="flex items-center">
                      <Badge className="mr-2">
                        {form.watch(
                          `sections.${sectionIndex}.lectures.${lectureIndex}.type`,
                        )}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeLecture(lectureIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {form.watch(
                    `sections.${sectionIndex}.lectures.${lectureIndex}.type`,
                  ) === "video" && (
                    <FormField
                      control={form.control}
                      name={`sections.${sectionIndex}.lectures.${lectureIndex}.videoUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter video URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch(
                    `sections.${sectionIndex}.lectures.${lectureIndex}.type`,
                  ) !== "video" && (
                    <FormField
                      control={form.control}
                      name={`sections.${sectionIndex}.lectures.${lectureIndex}.content`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {form.watch(
                              `sections.${sectionIndex}.lectures.${lectureIndex}.type`,
                            ) === "quiz"
                              ? "Quiz Content"
                              : "Lecture Content"}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={
                                form.watch(
                                  `sections.${sectionIndex}.lectures.${lectureIndex}.type`,
                                ) === "quiz"
                                  ? "Enter quiz questions and options"
                                  : "Enter lecture content"
                              }
                              className="min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CourseForm = ({
  initialData,
  onSubmit,
  apiEndpoint = "/api/v1/course/add-course",
}: CourseFormProps = {}) => {
  const { axios } = useAppContext();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const defaultValues: FormValues = initialData || {
    title: "",
    description: "",
    category: "",
    level: "",
    price: 0,
    thumbnail: null,
    sections: [
      {
        title: "Introduction",
        description: "",
        lectures: [
          {
            title: "Welcome to the course",
            type: "video",
            content: "",
            videoUrl: "",
          },
        ],
      },
    ],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
    move: moveSection,
  } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

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

      const sectionsData = data.sections.map((section) => ({
        title: section.title,
        description: section.description || "",
        lectures: section.lectures.map((lecture) => ({
          title: lecture.title,
          type: lecture.type,
          content: lecture.content || "",
          videoUrl: lecture.videoUrl || "",
        })),
      }));

      formData.append("sections", JSON.stringify(sectionsData));

      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Course created successfully:", response.data);

      setSubmitSuccess(true);

      if (onSubmit) onSubmit(data);

      setTimeout(() => {
        setSubmitSuccess(false);
        form.reset();
        setThumbnailPreview(null);
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting course:", error);
      setSubmitError(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
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
      form.setValue("thumbnail", file);
    }
  };

  const clearThumbnail = () => {
    setThumbnailPreview(null);
    form.setValue("thumbnail", null);
  };

  return (
    <div className="bg-background p-6 rounded-lg shadow-sm w-full max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Course Information
          </CardTitle>
          <CardDescription>Create or edit your course details</CardDescription>

          {/* Success/Error Messages */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
              Course created successfully!
            </div>
          )}

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
              Error: {submitError}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter course title" {...field} />
                        </FormControl>
                        <FormDescription>
                          A catchy title for your course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what students will learn"
                            className="min-h-32"
                            {...field}
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
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
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
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={clearThumbnail}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md">
                          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
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

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Course Sections</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendSection({
                        title: "",
                        description: "",
                        lectures: [],
                      })
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                </div>

                <Accordion type="multiple" className="w-full">
                  {sectionFields.map((section, sectionIndex) => (
                    <AccordionItem
                      key={section.id}
                      value={`section-${sectionIndex}`}
                    >
                      <div className="flex items-center">
                        <AccordionTrigger className="flex-1">
                          {form.watch(`sections.${sectionIndex}.title`) ||
                            `Section ${sectionIndex + 1}`}
                        </AccordionTrigger>
                        <div className="flex items-center mr-4 space-x-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (sectionIndex > 0)
                                moveSection(sectionIndex, sectionIndex - 1);
                            }}
                            disabled={sectionIndex === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (sectionIndex < sectionFields.length - 1)
                                moveSection(sectionIndex, sectionIndex + 1);
                            }}
                            disabled={sectionIndex === sectionFields.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSection(sectionIndex);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      <AccordionContent>
                        <SectionContent
                          sectionIndex={sectionIndex}
                          form={form}
                          section={section}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <CardFooter className="flex justify-end space-x-4 px-0">
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Course...
                    </>
                  ) : (
                    "Save Course"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseForm;

// Badge component
const Badge = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20 ${className}`}
    >
      {children}
    </span>
  );
};
