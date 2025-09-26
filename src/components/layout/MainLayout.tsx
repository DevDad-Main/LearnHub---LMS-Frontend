import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Search, Menu, X, User, ShoppingCart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { courses } from "../../assets/courses";
import CourseCard from "../course/CourseCard";
import Home from "../home";
import { useAppContext } from "../../context/AppContext";

// interface MainLayoutProps {
//   isAuthenticated?: boolean;
// }

const MainLayout = () => {
  const { user, instructor, handleLogout } = useAppContext();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { name: "Development", href: "/categories/development" },
    { name: "Business", href: "/categories/business" },
    { name: "IT & Software", href: "/categories/it-software" },
    { name: "Design", href: "/categories/design" },
    { name: "Marketing", href: "/categories/marketing" },
    { name: "Personal Development", href: "/categories/personal-development" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation Bar */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200",
          isScrolled ? "bg-background shadow-md" : "bg-background",
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary"></div>
            <span className="text-xl font-bold">LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {categories.map((category) => (
                        <li key={category.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={category.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {category.name}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    to="/courses"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    All Courses
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for courses..."
                className="h-9 w-[300px] rounded-md border border-input bg-background pl-10 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* {user ? ( */}
            {/*   <Button> */}
            {/*     <Link to={"/course/add-course"}>Add Course</Link> */}
            {/*   </Button> */}
            {/* ) : null} */}

            {instructor ? (
              <Button>
                <Link to={"/instructor/dashboard"}>Instructor Dashboard</Link>
              </Button>
            ) : null}

            {/* Shopping Cart */}
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>

            {/* User Menu or Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex md:items-center md:space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Log in
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 py-4">
                  <SheetClose asChild>
                    <Link to="/" className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-primary"></div>
                      <span className="text-xl font-bold">LearnHub</span>
                    </Link>
                  </SheetClose>

                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search for courses..."
                      className="h-9 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col space-y-2">
                    <SheetClose asChild>
                      <Link
                        to="/courses"
                        className="rounded-md px-4 py-2 text-sm hover:bg-accent"
                      >
                        All Courses
                      </Link>
                    </SheetClose>
                    <div className="px-4 py-2 text-sm font-medium">
                      Categories
                    </div>
                    {categories.map((category) => (
                      <SheetClose key={category.name} asChild>
                        <Link
                          to={category.href}
                          className="rounded-md px-6 py-2 text-sm hover:bg-accent"
                        >
                          {category.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  {/* Mobile Auth Buttons */}
                  {!user && (
                    <div className="mt-4 flex flex-col space-y-2">
                      <SheetClose asChild>
                        <Button variant="outline" asChild className="w-full">
                          <Link to="/login">Log in</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild className="w-full">
                          <Link to="/register">Sign up</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}

                  {/* Mobile Dashboard Link when authenticated */}
                  {user && (
                    <SheetClose asChild>
                      <Button variant="outline" asChild className="w-full">
                        <Link to="/dashboard">My Dashboard</Link>
                      </Button>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
        {/*   {courses.map((course) => ( */}
        {/*     <CourseCard key={course.id} course={course} /> */}
        {/*   ))} */}
        {/* </div> */}
        {/* <Home /> */}
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">LearnHub</h3>
              <p className="text-sm text-muted-foreground">
                Empowering learners worldwide with quality education and skills
                for the future.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Learn</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/courses"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/instructors"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Instructors
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/terms"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookies"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} LearnHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
