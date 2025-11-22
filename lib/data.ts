// Mock data for the application

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: "Workshop" | "Seminar" | "Hackathon" | "Conference"
  status: "Upcoming" | "Ongoing" | "Completed"
}

export interface Job {
  id: string
  company: string
  logo?: string
  position: string
  type: "Full-time" | "Internship" | "Part-time"
  location: string
  salary: string
  description: string
  requirements: string[]
  postedDate: string
}

export interface PlacementResource {
  id: string
  title: string
  category: "Guide" | "Resource" | "Company" | "Statistics"
  description: string
  link?: string
  downloadUrl?: string
}

export const events: Event[] = [
  {
    id: "1",
    title: "AI & Machine Learning Workshop",
    description:
      "Hands-on workshop covering fundamentals of AI and ML with practical implementations using Python and TensorFlow.",
    date: "2025-12-15",
    time: "10:00 AM - 4:00 PM",
    location: "CSE Lab 301",
    type: "Workshop",
    status: "Upcoming",
  },
  {
    id: "2",
    title: "Cloud Computing Seminar by AWS",
    description:
      "Industry experts from AWS will discuss cloud architecture, serverless computing, and career opportunities in cloud technologies.",
    date: "2025-12-20",
    time: "2:00 PM - 5:00 PM",
    location: "Auditorium Hall",
    type: "Seminar",
    status: "Upcoming",
  },
  {
    id: "3",
    title: "24-Hour Hackathon: Code Sprint 2025",
    description:
      "Annual coding competition where teams build innovative solutions. Prizes worth $10,000. Registration required.",
    date: "2026-01-10",
    time: "9:00 AM - Next Day 9:00 AM",
    location: "Innovation Center",
    type: "Hackathon",
    status: "Upcoming",
  },
  {
    id: "4",
    title: "Cybersecurity & Ethical Hacking Workshop",
    description:
      "Learn penetration testing, network security, and ethical hacking techniques from certified professionals.",
    date: "2026-01-25",
    time: "10:00 AM - 3:00 PM",
    location: "CSE Lab 204",
    type: "Workshop",
    status: "Upcoming",
  },
  {
    id: "5",
    title: "Tech Conference: Future of Software Engineering",
    description:
      "Two-day conference featuring talks from industry leaders at Google, Microsoft, and Meta about emerging technologies.",
    date: "2026-02-05",
    time: "9:00 AM - 6:00 PM",
    location: "Main Convention Hall",
    type: "Conference",
    status: "Upcoming",
  },
]

export const jobs: Job[] = [
  {
    id: "1",
    company: "Google",
    position: "Software Engineering Intern",
    type: "Internship",
    location: "Bangalore, India",
    salary: "₹80,000/month",
    description:
      "Join Google's engineering team to work on cutting-edge projects that impact billions of users worldwide. You'll collaborate with experienced engineers on real production systems.",
    requirements: [
      "Currently pursuing Bachelor's or Master's in Computer Science",
      "Strong foundation in data structures and algorithms",
      "Proficiency in one or more: Java, C++, Python, or Go",
      "Excellent problem-solving skills",
    ],
    postedDate: "2025-11-15",
  },
  {
    id: "2",
    company: "Microsoft",
    position: "Full Stack Developer",
    type: "Full-time",
    location: "Hyderabad, India",
    salary: "₹18-22 LPA",
    description:
      "Build cloud-based solutions using Azure, React, and .NET technologies. Work on enterprise-level applications used by Fortune 500 companies.",
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "2+ years experience with React, Node.js, and cloud platforms",
      "Strong understanding of RESTful APIs and microservices",
      "Experience with Azure or AWS is a plus",
    ],
    postedDate: "2025-11-20",
  },
  {
    id: "3",
    company: "Amazon",
    position: "SDE - Machine Learning",
    type: "Full-time",
    location: "Bengaluru, India",
    salary: "₹25-30 LPA",
    description:
      "Design and implement ML models for recommendation systems, fraud detection, and customer behavior analysis at Amazon scale.",
    requirements: [
      "Bachelor's/Master's in CS, ML, or related field",
      "Strong programming skills in Python and Java",
      "Experience with TensorFlow, PyTorch, or similar frameworks",
      "Understanding of distributed systems and big data technologies",
    ],
    postedDate: "2025-11-10",
  },
  {
    id: "4",
    company: "Flipkart",
    position: "Frontend Engineer Intern",
    type: "Internship",
    location: "Bangalore, India",
    salary: "₹50,000/month",
    description:
      "Create responsive and performant user interfaces for India's leading e-commerce platform. Learn from experienced UI/UX engineers.",
    requirements: [
      "Pursuing Bachelor's degree in Computer Science",
      "Strong knowledge of HTML, CSS, JavaScript",
      "Familiarity with React or Vue.js",
      "Good understanding of web performance optimization",
    ],
    postedDate: "2025-11-18",
  },
  {
    id: "5",
    company: "Infosys",
    position: "Systems Engineer",
    type: "Full-time",
    location: "Multiple Locations",
    salary: "₹3.6 LPA",
    description:
      "Entry-level position for fresh graduates. Work on diverse projects across various domains including banking, healthcare, and retail.",
    requirements: [
      "Bachelor's degree in Computer Science/IT/related field",
      "Good understanding of programming fundamentals",
      "Willingness to learn new technologies",
      "Minimum 60% aggregate in 10th, 12th, and graduation",
    ],
    postedDate: "2025-11-25",
  },
  {
    id: "6",
    company: "Accenture",
    position: "Application Development Associate",
    type: "Full-time",
    location: "Pune, India",
    salary: "₹4.5 LPA",
    description:
      "Join a global team developing enterprise applications for Fortune 500 clients. Training provided for latest technologies.",
    requirements: [
      "BE/B.Tech/MCA degree",
      "Knowledge of Java, C++, or Python",
      "Good analytical and communication skills",
      "No active backlogs",
    ],
    postedDate: "2025-11-22",
  },
]

export const placementResources: PlacementResource[] = [
  {
    id: "1",
    title: "Placement Preparation Complete Guide 2025",
    category: "Guide",
    description:
      "Comprehensive guide covering aptitude, technical interviews, HR rounds, and salary negotiation strategies.",
    downloadUrl: "#",
  },
  {
    id: "2",
    title: "Data Structures & Algorithms Question Bank",
    category: "Resource",
    description:
      "500+ coding problems with solutions covering all major DSA topics. Includes company-specific questions.",
    downloadUrl: "#",
  },
  {
    id: "3",
    title: "Google Interview Preparation",
    category: "Company",
    description:
      "Everything you need to know about Google's hiring process, coding rounds, and system design interviews.",
    link: "#",
  },
  {
    id: "4",
    title: "Placement Statistics 2024",
    category: "Statistics",
    description:
      "Detailed analysis of placement records: highest package (₹44 LPA), average package (₹8.2 LPA), companies visited (85+).",
    link: "#",
  },
  {
    id: "5",
    title: "Resume Building Workshop Recording",
    category: "Resource",
    description:
      "Learn how to craft ATS-friendly resumes that get noticed by recruiters. Includes templates and examples.",
    link: "#",
  },
  {
    id: "6",
    title: "Microsoft Placement Drive - Past Questions",
    category: "Company",
    description: "Collection of questions asked in Microsoft campus placements over the last 3 years.",
    downloadUrl: "#",
  },
]
