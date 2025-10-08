import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, Trash, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "../../context/AppContext";
import { useParams } from "react-router";

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

const MOCK_REVIEWS: Review[] = [
  // ... (same mock data)
];

const CourseReviews = () => {
  const { id } = useParams();
  const { axios, user } = useAppContext();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userEnrolled, setUserEnrolled] = useState(false);

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : 0;

  useEffect(() => {
    if (user && user.enrolledCourses && id) {
      const enrolled = user.enrolledCourses.some(
        (c: any) => c.course === id || c.course?._id === id
      );
      setUserEnrolled(enrolled);
    }
  }, [user, id]);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/v1/review/course/review/${id}`);
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews(
        [...MOCK_REVIEWS].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
      });
      return;
    }
    if (!comment.trim()) {
      toast({
        variant: "destructive",
        title: "Comment Required",
        description: "Please write a comment about your experience.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`/api/v1/review/course/review/${id}`, {
        rating,
        comment: comment.trim(),
      });

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });

      setRating(0);
      setComment("");
      setShowReviewForm(false);

      if (data.review) {
        setReviews((prev) =>
          [data.review, ...prev].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
      } else {
        fetchReviews();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to submit review",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🟢 NEW: Delete review handler
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const { data } = await axios.delete(`/api/v1/review/course/${id}/review/${reviewId}`);
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        toast({
          title: "Review Deleted",
          description: "Your review has been successfully removed.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to delete review.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const StarRating = ({
    value,
    onChange,
    readonly = false,
  }: {
    value: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`transition-all ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
        >
          <Star
            className={`h-6 w-6 ${star <= (hoverRating || value) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        </button>
      ))}
    </div>
  );

  const RatingDistribution = () => {
    const distribution = [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((r) => r.rating === stars).length;
      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
      return { stars, count, percentage };
    });

    return (
      <div className="space-y-2">
        {distribution.map(({ stars, count, percentage }) => (
          <div key={stars} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm font-medium">{stars}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground w-12 text-right">
              {count}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-background">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Student Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Rating Overview */}
          <div className="grid md:grid-cols-2 gap-8 pb-8 border-b">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-6xl font-bold">
                {averageRating.toFixed(1) || 0}
              </div>
              <StarRating value={Math.round(averageRating)} readonly />
              <p className="text-muted-foreground">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
            <div className="flex items-center">
              <RatingDistribution />
            </div>
          </div>

          {/* Write Review Section */}
          {userEnrolled && (
            <div className="space-y-4">
              {!showReviewForm ? (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="w-full md:w-auto"
                >
                  Write a Review
                </Button>
              ) : (
                <Card className="border-2 border-primary/20 bg-primary/5">
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Your Rating
                      </label>
                      <StarRating value={rating} onChange={setRating} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Your Review
                      </label>
                      <Textarea
                        placeholder="Share your experience with this course..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        maxLength={500}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {comment.length}/500 characters
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSubmitReview}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowReviewForm(false);
                          setRating(0);
                          setComment("");
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to review this course!
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <Card
                  key={review._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={review.user?.avatar || ""} />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">
                              {review.user.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                          <StarRating value={review.rating} readonly />
                        </div>
                        <p className="text-sm leading-relaxed">
                          {review.comment}
                        </p>
                        <div className="flex gap-2">
                          {/* <Button */}
                          {/*   variant="ghost" */}
                          {/*   size="sm" */}
                          {/*   onClick={() => handleHelpful(review._id)} */}
                          {/*   className="text-muted-foreground hover:text-primary" */}
                          {/* > */}
                          {/*   <ThumbsUp className="h-4 w-4 mr-2" /> */}
                          {/*   Helpful ({review.helpful || 0}) */}
                          {/* </Button> */}

                          {/* 🟢 NEW: Delete Button */}
                          {user?._id === review.user._id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-red-500 hover:text-red-600"
                            >
                            <Trash className="h-4 w-4 mr-2" />
                              Delete Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseReviews;
