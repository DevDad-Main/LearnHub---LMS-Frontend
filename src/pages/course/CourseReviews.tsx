import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, User } from "lucide-react";
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

interface CourseReviewsProps {
  userEnrolled?: boolean;
}

// Mock test data
const MOCK_REVIEWS: Review[] = [
  {
    _id: "1",
    user: {
      _id: "u1",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    rating: 5,
    comment:
      "This course exceeded my expectations! The instructor explains complex concepts in a very clear and engaging way. I've learned so much and can already apply these skills in my projects.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 12,
  },
  {
    _id: "2",
    user: {
      _id: "u2",
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    rating: 4,
    comment:
      "Great course overall! The content is well-structured and the examples are practical. Would have loved more advanced topics, but definitely worth the investment.",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 8,
  },
  {
    _id: "3",
    user: {
      _id: "u3",
      name: "Emily Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    rating: 5,
    comment:
      "Absolutely fantastic! As a beginner, I was worried I wouldn't keep up, but the instructor made everything so accessible. The hands-on projects really helped solidify my understanding.",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 15,
  },
  {
    _id: "4",
    user: {
      _id: "u4",
      name: "David Kim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    rating: 3,
    comment:
      "Good course but could use more real-world examples. The theory is solid but I would have appreciated more practical applications.",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 3,
  },
  {
    _id: "5",
    user: {
      _id: "u5",
      name: "Jessica Martinez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
    rating: 5,
    comment:
      "Best investment I've made in my career! The course content is up-to-date, comprehensive, and the instructor is incredibly knowledgeable. Highly recommend!",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 20,
  },
];

const CourseReviews = ({ userEnrolled = false }: CourseReviewsProps) => {
  const { id } = useParams();
  const { axios } = useAppContext();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  useEffect(() => {
    // Uncomment this when backend is ready
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/v1/review/course/review/${id}`);
      if (data.success) {
        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback!",
        });
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Fallback to mock data
      // setReviews(MOCK_REVIEWS);
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

    // Mock submission for testing
    const newReview: Review = {
      _id: String(reviews.length + 1),
      user: {
        _id: "current-user",
        name: "You",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      },
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      helpful: 0,
    };

    setReviews([newReview, ...reviews]);

    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });

    setRating(0);
    setComment("");
    setShowReviewForm(false);
    setIsSubmitting(false);

    // Uncomment when backend is ready
    /*
    try {
      await axios.post(`/api/v1/review/course/review/${id}`, {
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
      fetchReviews();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to submit review",
      });
    } finally {
      setIsSubmitting(false);
    }
    */
  };

  const handleHelpful = async (reviewId: string) => {
    // Mock helpful increment
    setReviews(
      reviews.map((r) =>
        r._id === reviewId ? { ...r, helpful: r.helpful + 1 } : r,
      ),
    );

    // Uncomment when backend is ready
    /*
    try {
      await axios.post(`/api/v1/course/review/${reviewId}/helpful`);
      fetchReviews();
    } catch (error) {
      console.error("Error marking review as helpful:", error);
    }
    */
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
  }) => {
    return (
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
              className={`h-6 w-6 ${
                star <= (hoverRating || value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

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
                {averageRating.toFixed(1)}
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
                        <AvatarImage src={review.user.avatar} />
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleHelpful(review._id)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Helpful ({review.helpful || 0})
                        </Button>
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
