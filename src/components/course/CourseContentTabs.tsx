import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircle,
  FileText,
  BookOpen,
  FileQuestion,
  Download,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

interface CourseContentTabsProps {
  courseId?: string;
  lectureId?: string;
}

const CourseContentTabs = ({ course }: CourseContentTabsProps) => {
  const { toast } = useToast();
  const { axios } = useAppContext();
  const [activeTab, setActiveTab] = useState("content");
  const [newQuestion, setNewQuestion] = useState("");
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [timestamp, setTimestamp] = useState("");

  // Mock questions
  const questions = [
    {
      id: 1,
      user: "Alex Johnson",
      avatar: "AJ",
      date: "2 days ago",
      question: "How do I implement useEffect with cleanup functions properly?",
      answers: 3,
      likes: 12,
    },
    {
      id: 2,
      user: "Maria Garcia",
      avatar: "MG",
      date: "1 week ago",
      question:
        "Can someone explain the difference between useMemo and useCallback?",
      answers: 5,
      likes: 8,
    },
  ];

  const resources = [
    { id: 1, name: "React Hooks Cheatsheet.pdf", size: "1.2 MB", type: "PDF" },
    { id: 2, name: "Project Source Code.zip", size: "3.5 MB", type: "ZIP" },
    { id: 3, name: "Lecture Slides.pptx", size: "5.8 MB", type: "PPTX" },
  ];

  // --- Handlers ---
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Question submitted:", newQuestion);
    setNewQuestion("");
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/v1/note/${course._id}/add`, {
        content: newNote,
        timeStamp: timestamp,
      });
      if (data.success) {
        toast({ title: "Success", description: "Note added successfully" });
        setNewNote("");
        setTimestamp("");
        setNotes([...notes, data.note]);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/note/${course._id}/${noteId}`,
      );
      if (data.success) {
        setNotes(notes.filter((n) => n._id !== noteId));
        toast({ title: "Deleted", description: "Note removed successfully" });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await axios.get(`/api/v1/note/${course._id}/notes`);
        if (data.success) {
          setNotes(data.notes || []);
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to fetch notes",
          variant: "destructive",
        });
      }
    };
    fetchNotes();
  }, [course?._id]);

  return (
    <div className="w-full bg-background">
      <Tabs
        defaultValue="content"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Course Content</span>
            <span className="sm:hidden">Content</span>
          </TabsTrigger>
          <TabsTrigger value="qa" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Q&A</span>
            <span className="sm:hidden">Q&A</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Notes</span>
            <span className="sm:hidden">Notes</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <FileQuestion className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
            <span className="sm:hidden">Files</span>
          </TabsTrigger>
        </TabsList>

        {/* Course Content */}
        <TabsContent value="content" className="border rounded-md p-4">
          <div className="space-y-6">
            {/* Instructor Section */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">
                Meet Your Instructor
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={course?.instructor?.avatar}
                      alt={course?.instructor?.name}
                    />
                    <AvatarFallback className="text-lg">JS</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold mb-2">
                    {course?.instructor?.name}
                  </h4>
                  <p className="text-primary font-medium mb-3">
                    {course?.instructor?.profession}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {course?.instructor?.bio}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="font-semibold text-lg">
                        {course?.totalStudents}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {course?.totalStudents === 1 ? "Student" : "Students"}
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="font-semibold text-lg">4.8</div>
                      <div className="text-xs text-muted-foreground">
                        Rating
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="font-semibold text-lg">
                        {course?.instructor?.createdCourses.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Courses
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="font-semibold text-lg">8</div>
                      <div className="text-xs text-muted-foreground">
                        Years Exp
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h5 className="font-medium mb-2">Expertise</h5>
                <div className="flex flex-wrap gap-2">
                  {course?.instructor?.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About This Course</h3>
              <p className="text-muted-foreground mb-4">
                {course?.description}
              </p>
              <div className="mt-6">
                <h4 className="font-medium mb-2">What you'll learn</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {course?.learnableSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Q&A */}
        <TabsContent value="qa" className="border rounded-md">
          <Card>
            <CardContent className="p-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Ask a Question</h3>
                <form onSubmit={handleQuestionSubmit} className="space-y-4">
                  <Textarea
                    placeholder="What's your question about this lecture?"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button type="submit" disabled={!newQuestion.trim()}>
                    Submit Question
                  </Button>
                </form>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Questions in this lecture
                </h3>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    {questions.map((q) => (
                      <div key={q.id} className="border-b pb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${q.user}`}
                              alt={q.user}
                            />
                            <AvatarFallback>{q.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{q.user}</p>
                            <p className="text-xs text-muted-foreground">
                              {q.date}
                            </p>
                          </div>
                        </div>
                        <p className="my-2">{q.question}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" /> {q.answers}{" "}
                            answers
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" /> {q.likes}
                          </span>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            Answer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes */}
        <TabsContent value="notes" className="border rounded-md">
          <Card>
            <CardContent className="p-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Add Note</h3>
                <form onSubmit={handleNoteSubmit} className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-24">
                      <Input
                        type="text"
                        placeholder="00:00"
                        value={timestamp}
                        onChange={(e) => setTimestamp(e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Current timestamp
                    </p>
                  </div>
                  <Textarea
                    placeholder="Add your notes about this part of the lecture..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button type="submit" disabled={!newNote.trim()}>
                    Save Note
                  </Button>
                </form>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Your Notes</h3>
                <ScrollArea className="max-h-[500px] pr-4">
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div
                        key={note._id}
                        className="border p-4 rounded-md relative"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                            {note.timeStamp}
                          </div>
                          <span className="text-xs text-muted-foreground mt-8">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bottom-2"
                          onClick={() => handleDeleteNote(note._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources" className="border rounded-md">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Course Resources</h3>
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary p-2 rounded">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{resource.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {resource.size} • {resource.type}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseContentTabs;
