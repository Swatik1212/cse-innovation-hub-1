"use client"

// Authentication helper functions
export interface User {
  id: string
  email: string
  name: string
  rollNumber: string
  department: string
  year: string
}

export function saveUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user))
    const users = getUsers()
    const existingIndex = users.findIndex((u) => u.email === user.email)
    if (existingIndex >= 0) {
      users[existingIndex] = user
    } else {
      users.push(user)
    }
    localStorage.setItem("users", JSON.stringify(users))
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
  }
}

export function login(email: string, password: string): User | null {
  const users = getUsers()
  const user = users.find((u) => u.email === email)
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
    return user
  }
  return null
}
