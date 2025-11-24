"use client"

// Authentication helper functions
export interface User {
  id: string
  email: string
  name: string
  rollNumber: string
  department: string
  year: string
  role?: "student" | "admin"
}

export async function saveUser(user: User) {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: user.name,
        email: user.email,
        password: (user as any).password || "changeme",
        course: user.department,
        year_of_study: user.year,
      }),
    })
    const data = await res.json()
    if (!res.ok) return null
    const role = data.role || (user.email === "admin@csehub.com" ? "admin" : "student")
    const withRole = { ...user, role, id: String(data.id || user.id) }
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(withRole))
    }
    return withRole
  } catch {
    return null
  }
}

export function getUsers(): User[] {
  if (typeof window !== "undefined") {
    const users = localStorage.getItem("users")
    return users ? JSON.parse(users) : []
  }
  return []
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("currentUser")
    return user ? JSON.parse(user) : null
  }
  return null
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
    document.cookie = "role=; Max-Age=0; path=/"
  }
}

export async function login(email: string, password: string): Promise<User | null> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      credentials: "include",
    })
    const data = await res.json()
    if (!res.ok) return null
    const role = data.role || (email.trim().toLowerCase() === "admin@csehub.com" ? "admin" : "student")
    const user: User = {
      id: String(data.id || ""),
      email: email.trim().toLowerCase(),
      name: data.name || "",
      rollNumber: "",
      department: "",
      year: "",
      role,
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(user))
    }
    return user
  } catch {
    return null
  }
}
