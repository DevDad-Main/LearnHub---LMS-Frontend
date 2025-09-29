import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Toast } from "@radix-ui/react-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  Clock,
  Users,
  Tag,
  CreditCard,
  Shield,
} from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  duration: string;
  lectures: number;
  level: string;
  quantity: number;
}

const Cart = () => {
  // const [cartItems, setCartItems] = useState<CartItem[]>([
  //   {
  //     id: 1,
  //     title: "Complete React Developer Course",
  //     instructor: "Alex Wilson",
  //     rating: 4.8,
  //     reviewCount: 1876,
  //     price: 84.99,
  //     originalPrice: 199.99,
  //     thumbnail:
  //       "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  //     duration: "42 hours",
  //     lectures: 156,
  //     level: "All Levels",
  //     quantity: 1,
  //   },
  //   {
  //     id: 2,
  //     title: "Python for Data Science and Machine Learning",
  //     instructor: "John Doe",
  //     rating: 4.9,
  //     reviewCount: 2341,
  //     price: 94.99,
  //     originalPrice: 179.99,
  //     thumbnail:
  //       "https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?w=800&q=80",
  //     duration: "38 hours",
  //     lectures: 142,
  //     level: "Intermediate",
  //     quantity: 1,
  //   },
  //   {
  //     id: 3,
  //     title: "UI/UX Design Fundamentals",
  //     instructor: "Emma Davis",
  //     rating: 4.7,
  //     reviewCount: 1123,
  //     price: 74.99,
  //     originalPrice: 149.99,
  //     thumbnail:
  //       "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  //     duration: "28 hours",
  //     lectures: 98,
  //     level: "Beginner",
  //     quantity: 1,
  //   },
  // ]);

  const { axios, user } = useAppContext();
  const [cartItems, setCartItems] = useState([]);

  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  function formatDuration(seconds?: number) {
    if (!seconds) return "0m";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      if (minutes === 0 && seconds > 0) {
        return "1m"; // anything less than a minute rounds up
      }
      return `${minutes}m`;
    }
  }

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data } = await axios.get("/api/v1/users/cart/get");
        if (data.success) {
          console.log(data);
          setCartItems(data.cart);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              data.response?.data?.message || "Failed to load course",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.response?.data?.message || "Failed to add course to cart",
        });
      }
    };
    fetchCartItems();
  }, [user]);

  useEffect(() => {}, [cartItems]);
  const removeFromCart = async (id: number) => {
    try {
      const { data } = await axios.delete(`/api/v1/users/cart/delete/${id}`);
      if (data.success) {
        toast({
          title: "Course Removed",
          description: data.response?.data?.message,
        });
        console.log(data.message);
        // setCartItems(data.cart);
        setCartItems(cartItems.filter((item) => item.course?._id !== id));
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.response?.data?.message || "Failed to load course",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to load course",
      });
    }
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save20") {
      setAppliedPromo("SAVE20");
      setPromoCode("");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.course?.price * item.quantity,
    0,
  );
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + (item.course?.price || item.price) * item.quantity,
    0,
  );
  const discount = appliedPromo ? subtotal * 0.2 : 0;
  const total = subtotal - discount;
  const totalSavings = originalTotal - total;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any courses to your cart yet. Browse
              our courses and find something you love!
            </p>
            <Button asChild size="lg">
              <Link to="/">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? "course" : "courses"}{" "}
            in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item?.course?._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Course Image */}
                    <div className="relative w-full sm:w-48 h-32 sm:h-auto">
                      <img
                        src={item?.course?.thumbnail}
                        alt={item?.course.title}
                        className="w-full h-full object-cover"
                      />
                      {/* {item?.course?.price && ( */}
                      {/*   <Badge */}
                      {/*     variant="destructive" */}
                      {/*     className="absolute top-2 right-2" */}
                      {/*   > */}
                      {/*     {Math.round( */}
                      {/*       (1 - */}
                      {/*         item?.course?.price / */}
                      {/*           item?.course?.originalPrice) * */}
                      {/*         100, */}
                      {/*     )} */}
                      {/*     % off */}
                      {/*   </Badge> */}
                      {/* )} */}
                    </div>

                    {/* Course Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <Link
                            to={`/course/${item?.course?._id}`}
                            className="text-lg font-semibold hover:text-primary line-clamp-2"
                          >
                            {item?.course?.title}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            By {item?.course?.instructor.name}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.course._id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                          <span className="font-medium mr-1">
                            {item.rating}
                          </span>
                          {/* <span>({item.reviewCount.toLocaleString()})</span> */}
                          <span>({Math.floor(Math.random() * 2000)})</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDuration(item.course?.totalDuration)}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {item?.course?.sections?.reduce(
                            (acc, section) => acc + section.lectures.length,
                            0,
                          )}{" "}
                          lectures
                          {/* {item.course?.lectures?.length} lectures */}
                        </div>
                        <Badge variant="outline">{item?.course?.level}</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            Qty: {item?.quantity}
                          </span>
                          {/* <div className="flex items-center border rounded-md"> */}
                          {/*   <Button */}
                          {/*     variant="ghost" */}
                          {/*     size="icon" */}
                          {/*     className="h-8 w-8" */}
                          {/*     onClick={() => */}
                          {/*       updateQuantity(item.id, item.quantity - 1) */}
                          {/*     } */}
                          {/*     disabled={item.quantity <= 1} */}
                          {/*   > */}
                          {/*     <Minus className="h-3 w-3" /> */}
                          {/*   </Button> */}
                          {/*   <span className="px-3 py-1 text-sm"> */}
                          {/*     {item.quantity} */}
                          {/*   </span> */}
                          {/*   <Button */}
                          {/*     variant="ghost" */}
                          {/*     size="icon" */}
                          {/*     className="h-8 w-8" */}
                          {/*     onClick={() => */}
                          {/*       updateQuantity(item.id, item.quantity + 1) */}
                          {/*     } */}
                          {/*   > */}
                          {/*     <Plus className="h-3 w-3" /> */}
                          {/*   </Button> */}
                          {/* </div> */}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            ${(item.course?.price * item.quantity).toFixed(2)}
                          </div>
                          {/* {item.course?.price && ( */}
                          {/*   <div className="text-sm text-muted-foreground line-through"> */}
                          {/*     ${(item.course?.price * item.quantity).toFixed(2)} */}
                          {/*   </div> */}
                          {/* )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Promo Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Promo Code</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={applyPromoCode}
                      disabled={!promoCode}
                    >
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  {appliedPromo && (
                    <div className="flex items-center text-sm text-green-600">
                      <Tag className="h-4 w-4 mr-1" />
                      {appliedPromo} applied - 20% off!
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Promo Discount:</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Total Savings:</span>
                    <span className="text-green-600">
                      -${totalSavings.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Button className="w-full" size="lg">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>

                <div className="flex items-center justify-center text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 mr-1" />
                  30-Day Money-Back Guarantee
                </div>

                <Separator />

                {/* Course Benefits */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">This order includes:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Lifetime access to all courses</li>
                    <li>• Access on mobile and desktop</li>
                    <li>• Downloadable resources</li>
                    <li>• Certificate of completion</li>
                    <li>• 30-day money-back guarantee</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <div className="mt-6 text-center">
              <Button variant="outline" asChild>
                <Link to="/">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
