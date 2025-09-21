export interface Instructor {
  name: string;
  title: string;
  avatar: string;
  rating: number;
  students: number;
  courses: number;
}

export interface CurriculumSection {
  section: string;
  lectures: number;
  duration: string;
  lessons: {
    title: string;
    duration: string;
    isPreview: boolean;
  }[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  instructor: Instructor;
  thumbnail: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  duration: string;
  lectures: number;
  level: string;
  language: string;
  category: string;
  tags: string[];
  lastUpdated: string;
  description: string;
  whatYouWillLearn: string[];
  requirements: string[];
  curriculum: CurriculumSection[];
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Complete React Developer in 2024",
    subtitle:
      "Learn React, Hooks, Redux, React Router, Next.js, Best Practices and build amazing projects",
    instructor: {
      name: "John Smith",
      title: "Senior Full Stack Developer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      rating: 4.8,
      students: 125000,
      courses: 12,
    },
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    price: 89.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviewCount: 15420,
    studentCount: 89543,
    duration: "42 hours",
    lectures: 156,
    level: "All Levels",
    language: "English",
    category: "Web Development",
    tags: ["React", "JavaScript", "Frontend", "Web Development", "Redux"],
    lastUpdated: "November 2023",
    description: `Master React development from the ground up! This comprehensive course covers everything you need to know to become a professional React developer. You'll learn modern React with Hooks, state management with Redux, routing with React Router, and even Next.js for server-side rendering.

Perfect for beginners and intermediate developers looking to level up their React skills. By the end of this course, you'll have built several real-world projects and have the confidence to tackle any React project.`,
    whatYouWillLearn: [
      "Build powerful, fast, user-friendly and reactive web apps",
      "Provide amazing user experiences by leveraging the power of JavaScript",
      "Apply for high-paid jobs or work as a freelancer in one the most-demanded sectors",
      "Learn all about React Hooks and React Components",
      "Master Redux for state management",
      "Build real-world projects that you can add to your portfolio",
    ],
    requirements: [
      "Basic JavaScript knowledge is required",
      "NO prior React or any other JS framework experience is required!",
      "Basic HTML + CSS knowledge helps but is not a must-have",
    ],
    curriculum: [
      {
        section: "Getting Started",
        lectures: 8,
        duration: "1h 23m",
        lessons: [
          { title: "Course Introduction", duration: "5:32", isPreview: true },
          { title: "What is React?", duration: "8:45", isPreview: true },
          {
            title: "Setting up the Development Environment",
            duration: "12:15",
            isPreview: false,
          },
          {
            title: "Creating Your First React App",
            duration: "15:30",
            isPreview: false,
          },
          { title: "Understanding JSX", duration: "18:22", isPreview: false },
          {
            title: "Components and Props",
            duration: "14:45",
            isPreview: false,
          },
          {
            title: "State and Event Handling",
            duration: "16:33",
            isPreview: false,
          },
          { title: "Section Summary", duration: "3:45", isPreview: false },
        ],
      },
      {
        section: "React Fundamentals",
        lectures: 12,
        duration: "2h 45m",
        lessons: [
          { title: "Component Lifecycle", duration: "22:15", isPreview: false },
          { title: "Handling Forms", duration: "18:30", isPreview: false },
          { title: "Lists and Keys", duration: "15:45", isPreview: false },
          {
            title: "Conditional Rendering",
            duration: "12:20",
            isPreview: false,
          },
          { title: "Styling Components", duration: "20:10", isPreview: false },
          {
            title: "React Hooks Introduction",
            duration: "25:30",
            isPreview: false,
          },
          { title: "useState Hook", duration: "18:45", isPreview: false },
          { title: "useEffect Hook", duration: "24:15", isPreview: false },
          { title: "Custom Hooks", duration: "19:30", isPreview: false },
          { title: "Context API", duration: "21:45", isPreview: false },
          { title: "Error Boundaries", duration: "16:20", isPreview: false },
          { title: "Section Project", duration: "35:40", isPreview: false },
        ],
      },
      {
        section: "Advanced React Concepts",
        lectures: 15,
        duration: "3h 20m",
        lessons: [
          {
            title: "Performance Optimization",
            duration: "28:15",
            isPreview: false,
          },
          {
            title: "React.memo and useMemo",
            duration: "22:30",
            isPreview: false,
          },
          { title: "useCallback Hook", duration: "18:45", isPreview: false },
          { title: "Code Splitting", duration: "20:10", isPreview: false },
          { title: "Lazy Loading", duration: "16:30", isPreview: false },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Python for Data Science and Machine Learning",
    subtitle:
      "Master Python, Pandas, NumPy, Matplotlib, and Scikit-learn for Data Analysis and Machine Learning",
    instructor: {
      name: "Emma Johnson",
      title: "Data Scientist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      rating: 4.9,
      students: 98000,
      courses: 8,
    },
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    price: 79.99,
    originalPrice: 179.99,
    rating: 4.8,
    reviewCount: 12350,
    studentCount: 67234,
    duration: "35 hours",
    lectures: 142,
    level: "Intermediate",
    language: "English",
    category: "Data Science",
    tags: ["Python", "Data Science", "Machine Learning", "Pandas", "NumPy"],
    lastUpdated: "January 2024",
    description: `Dive into the world of data science with this comprehensive Python course. Learn how to manipulate, analyze, and visualize data using Pandas, NumPy, and Matplotlib. Build machine learning models with Scikit-learn and understand key concepts like regression, classification, and clustering. Perfect for those looking to start a career in data science or enhance their analytical skills.`,
    whatYouWillLearn: [
      "Master Python programming for data science",
      "Work with large datasets using Pandas and NumPy",
      "Create stunning visualizations with Matplotlib and Seaborn",
      "Build and evaluate machine learning models",
      "Understand key data science workflows and best practices",
      "Apply your skills to real-world data science projects",
    ],
    requirements: [
      "Basic programming knowledge is recommended",
      "No prior data science experience required",
      "A computer with Python installed",
    ],
    curriculum: [
      {
        section: "Introduction to Data Science",
        lectures: 6,
        duration: "1h 10m",
        lessons: [
          { title: "What is Data Science?", duration: "6:20", isPreview: true },
          {
            title: "Python Setup and Installation",
            duration: "10:15",
            isPreview: true,
          },
          {
            title: "Introduction to Jupyter Notebooks",
            duration: "12:30",
            isPreview: false,
          },
          { title: "Python Basics Recap", duration: "15:45", isPreview: false },
          {
            title: "Working with Lists and Dictionaries",
            duration: "14:20",
            isPreview: false,
          },
          { title: "Section Quiz", duration: "3:50", isPreview: false },
        ],
      },
      {
        section: "Data Analysis with Pandas",
        lectures: 10,
        duration: "2h 30m",
        lessons: [
          {
            title: "Introduction to Pandas",
            duration: "20:10",
            isPreview: false,
          },
          {
            title: "DataFrames and Series",
            duration: "18:45",
            isPreview: false,
          },
          { title: "Data Cleaning", duration: "22:30", isPreview: false },
          {
            title: "Grouping and Aggregating Data",
            duration: "19:15",
            isPreview: false,
          },
          { title: "Merging Datasets", duration: "21:20", isPreview: false },
          {
            title: "Working with Missing Data",
            duration: "16:40",
            isPreview: false,
          },
          { title: "Data Filtering", duration: "14:50", isPreview: false },
          {
            title: "Pandas Best Practices",
            duration: "17:25",
            isPreview: false,
          },
          {
            title: "Section Project: Data Analysis",
            duration: "30:00",
            isPreview: false,
          },
          { title: "Section Summary", duration: "4:15", isPreview: false },
        ],
      },
      {
        section: "Machine Learning Basics",
        lectures: 12,
        duration: "3h 15m",
        lessons: [
          {
            title: "Introduction to Machine Learning",
            duration: "25:30",
            isPreview: false,
          },
          {
            title: "Supervised vs Unsupervised Learning",
            duration: "20:45",
            isPreview: false,
          },
          { title: "Linear Regression", duration: "22:15", isPreview: false },
          {
            title: "Classification Models",
            duration: "19:30",
            isPreview: false,
          },
          {
            title: "Model Evaluation Metrics",
            duration: "18:20",
            isPreview: false,
          },
          {
            title: "Section Project: Predictive Modeling",
            duration: "35:40",
            isPreview: false,
          },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Complete AWS Cloud Practitioner Certification",
    subtitle:
      "Prepare for the AWS Cloud Practitioner Exam with hands-on labs and real-world scenarios",
    instructor: {
      name: "Michael Brown",
      title: "AWS Certified Solutions Architect",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      rating: 4.7,
      students: 56000,
      courses: 5,
    },
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    price: 69.99,
    originalPrice: 149.99,
    rating: 4.6,
    reviewCount: 8920,
    studentCount: 45123,
    duration: "28 hours",
    lectures: 108,
    level: "Beginner",
    language: "English",
    category: "Cloud Computing",
    tags: ["AWS", "Cloud Computing", "Certification", "DevOps"],
    lastUpdated: "March 2024",
    description: `Get certified as an AWS Cloud Practitioner with this comprehensive course. Learn the fundamentals of cloud computing, AWS services, pricing, and architecture. Includes hands-on labs and practice exams to ensure you're ready to ace the AWS Cloud Practitioner certification exam.`,
    whatYouWillLearn: [
      "Understand AWS cloud concepts and services",
      "Learn AWS pricing and billing",
      "Master key AWS services like EC2, S3, and RDS",
      "Prepare for the AWS Cloud Practitioner exam",
      "Gain hands-on experience with AWS Management Console",
      "Understand cloud security and compliance",
    ],
    requirements: [
      "No prior AWS experience required",
      "Basic understanding of IT concepts is helpful",
      "A free AWS account for hands-on labs",
    ],
    curriculum: [
      {
        section: "Introduction to AWS",
        lectures: 5,
        duration: "1h 05m",
        lessons: [
          { title: "What is AWS?", duration: "7:15", isPreview: true },
          {
            title: "Setting up an AWS Account",
            duration: "9:30",
            isPreview: true,
          },
          {
            title: "AWS Global Infrastructure",
            duration: "14:20",
            isPreview: false,
          },
          {
            title: "AWS Management Console",
            duration: "12:45",
            isPreview: false,
          },
          { title: "Section Quiz", duration: "3:10", isPreview: false },
        ],
      },
      {
        section: "Core AWS Services",
        lectures: 10,
        duration: "2h 20m",
        lessons: [
          { title: "Introduction to EC2", duration: "18:30", isPreview: false },
          { title: "Working with S3", duration: "20:15", isPreview: false },
          { title: "RDS and Databases", duration: "17:45", isPreview: false },
          { title: "VPC and Networking", duration: "19:20", isPreview: false },
          { title: "IAM and Security", duration: "16:50", isPreview: false },
          {
            title: "Section Lab: Launch an EC2 Instance",
            duration: "30:00",
            isPreview: false,
          },
        ],
      },
      {
        section: "AWS Certification Prep",
        lectures: 8,
        duration: "1h 50m",
        lessons: [
          { title: "Exam Overview", duration: "15:30", isPreview: false },
          {
            title: "Practice Exam Questions",
            duration: "25:45",
            isPreview: false,
          },
          {
            title: "Tips for Passing the Exam",
            duration: "12:20",
            isPreview: false,
          },
          { title: "Final Practice Exam", duration: "35:40", isPreview: false },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "UI/UX Design with Figma",
    subtitle:
      "Learn to design user interfaces and user experiences with Figma from scratch",
    instructor: {
      name: "Sarah Williams",
      title: "Lead UI/UX Designer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      rating: 4.8,
      students: 72000,
      courses: 7,
    },
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    price: 59.99,
    originalPrice: 129.99,
    rating: 4.7,
    reviewCount: 10340,
    studentCount: 58321,
    duration: "22 hours",
    lectures: 95,
    level: "All Levels",
    language: "English",
    category: "Design",
    tags: ["UI/UX", "Figma", "Design", "Prototyping"],
    lastUpdated: "February 2024",
    description: `Become a UI/UX designer with this hands-on Figma course. Learn how to create user-friendly interfaces, wireframes, and prototypes. Master design principles, user research, and prototyping techniques to build stunning designs for web and mobile apps.`,
    whatYouWillLearn: [
      "Master Figma for UI/UX design",
      "Create wireframes and high-fidelity prototypes",
      "Understand user research and usability testing",
      "Design responsive layouts for web and mobile",
      "Learn design systems and component libraries",
      "Build a professional design portfolio",
    ],
    requirements: [
      "No prior design experience required",
      "A computer with Figma installed",
      "Basic understanding of design concepts is a plus",
    ],
    curriculum: [
      {
        section: "Introduction to UI/UX",
        lectures: 6,
        duration: "1h 15m",
        lessons: [
          { title: "What is UI/UX Design?", duration: "8:20", isPreview: true },
          { title: "Setting up Figma", duration: "10:45", isPreview: true },
          {
            title: "Figma Interface Overview",
            duration: "12:30",
            isPreview: false,
          },
          { title: "Design Principles", duration: "15:25", isPreview: false },
          { title: "Color Theory", duration: "13:40", isPreview: false },
          { title: "Section Quiz", duration: "3:20", isPreview: false },
        ],
      },
      {
        section: "Designing with Figma",
        lectures: 10,
        duration: "2h 10m",
        lessons: [
          { title: "Creating Wireframes", duration: "18:30", isPreview: false },
          {
            title: "High-Fidelity Prototypes",
            duration: "20:15",
            isPreview: false,
          },
          {
            title: "Working with Components",
            duration: "17:45",
            isPreview: false,
          },
          { title: "Responsive Design", duration: "19:20", isPreview: false },
          {
            title: "Prototyping Interactions",
            duration: "16:50",
            isPreview: false,
          },
          {
            title: "Section Project: App Design",
            duration: "30:00",
            isPreview: false,
          },
        ],
      },
      {
        section: "User Research and Testing",
        lectures: 7,
        duration: "1h 40m",
        lessons: [
          {
            title: "Conducting User Research",
            duration: "15:30",
            isPreview: false,
          },
          {
            title: "Usability Testing Basics",
            duration: "20:45",
            isPreview: false,
          },
          { title: "Analyzing Feedback", duration: "12:20", isPreview: false },
          { title: "Iterating Designs", duration: "18:40", isPreview: false },
        ],
      },
    ],
  },
];
