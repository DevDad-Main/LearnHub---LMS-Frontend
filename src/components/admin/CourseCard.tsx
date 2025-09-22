import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  thumbnailUrl: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const CourseCard = ({
  id = "1",
  title = "Introduction to Web Development",
  description = "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
  category = "Web Development",
  level = "beginner",
  price = 49.99,
  thumbnailUrl = "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
}: CourseCardProps) => {
  const levelColorMap = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };

  const levelColor = levelColorMap[level] || levelColorMap.beginner;

  return (
    <Card className="overflow-hidden h-full flex flex-col bg-white">
      <div className="relative h-48 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className={levelColor}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Badge>
        </div>
      </div>
      <CardContent className="flex-grow p-4">
        <h3 className="text-lg font-semibold line-clamp-2 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 line-clamp-3 mb-2">{description}</p>
        <div className="flex justify-between items-center mt-auto">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          <span className="font-bold text-primary">${price.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(id)}
          className="flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(id)}
          className="flex items-center gap-1"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                course and remove all associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(id)}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
