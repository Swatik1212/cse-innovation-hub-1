// This file simulates a database connection for the preview.
// In a real app, you would replace this with a MySQL connection using 'mysql2' or an ORM like 'prisma'.

export type Event = {
  id: number
  title: string
  description: string
  date: string
  location: string
}

export type Job = {
  id: number
  title: string
  company: string
  type: "Internship" | "Full-time"
  description: string
  postedDate: string
}

export type PlacementUpdate = {
  id: number
  title: string
  content: string
  category: "Guideline" | "Announcement"
}

// Mock Data
export const EVENTS: Event[] = [
  {
    id: 1,
    title: "AI & Machine Learning Workshop",
    description: "A hands-on workshop on the basics of Neural Networks.",
    date: "2023-11-25",
    location: "Lab 3, CSE Block",
  },
  {
    id: 2,
    title: "Annual Hackathon 2023",
    description: "24-hour coding competition. Win exciting prizes!",
    date: "2023-12-10",
    location: "Main Auditorium",
  },
]

export const JOBS: Job[] = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechCorp Solutions",
    type: "Internship",
    description: "Looking for React.js developers for a 6-month internship.",
    postedDate: "2023-11-20",
  },
  {
    id: 2,
    title: "Junior Software Engineer",
    company: "InnovateX",
    type: "Full-time",
    description: "Fresh graduates with strong Java and SQL skills.",
    postedDate: "2023-11-18",
  },
]

export const PLACEMENTS: PlacementUpdate[] = [
  {
    id: 1,
    title: "Resume Building Session",
    content: "Join us this Friday for a session on crafting the perfect resume.",
    category: "Guideline",
  },
  {
    id: 2,
    title: "TCS Recruitment Drive",
    content: "TCS will be visiting campus on Dec 5th. Eligibility: 7.5 CGPA.",
    category: "Announcement",
  },
]
