"use client"

import { useState, useEffect } from "react"
import LoginForm from "@/components/login-form"
import StudentDashboard from "@/components/student-dashboard"
import AdminDashboard from "@/components/admin-dashboard"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (user: any) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
    localStorage.setItem("currentUser", JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("currentUser")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {isAuthenticated ? (
        currentUser.type === "admin" ? (
          <AdminDashboard user={currentUser} onLogout={handleLogout} />
        ) : (
          <StudentDashboard user={currentUser} onLogout={handleLogout} />
        )
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </main>
  )
}
