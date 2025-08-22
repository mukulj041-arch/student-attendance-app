"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, User, Lock, Shield } from "lucide-react"

// Mock student data
const mockStudents = [
  {
    id: "1",
    studentId: "STU001",
    name: "Alice Johnson",
    email: "alice@college.edu",
    password: "password123",
    course: "Computer Science",
    year: "3rd Year",
    type: "student",
  },
  {
    id: "2",
    studentId: "STU002",
    name: "Bob Smith",
    email: "bob@college.edu",
    password: "password123",
    course: "Engineering",
    year: "2nd Year",
    type: "student",
  },
  {
    id: "3",
    studentId: "STU003",
    name: "Carol Davis",
    email: "carol@college.edu",
    password: "password123",
    course: "Business",
    year: "4th Year",
    type: "student",
  },
]

const mockAdmins = [
  {
    id: "admin1",
    adminId: "ADMIN001",
    name: "Dr. Sarah Wilson",
    email: "admin@college.edu",
    password: "admin123",
    role: "Administrator",
    department: "Academic Affairs",
    type: "admin",
  },
  {
    id: "admin2",
    adminId: "ADMIN002",
    name: "Prof. Michael Brown",
    email: "registrar@college.edu",
    password: "admin123",
    role: "Registrar",
    department: "Student Services",
    type: "admin",
  },
]

interface LoginFormProps {
  onLogin: (user: any) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [studentId, setStudentId] = useState("")
  const [adminId, setAdminId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("student")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (activeTab === "student") {
      const student = mockStudents.find((s) => s.studentId === studentId && s.password === password)
      if (student) {
        onLogin(student)
      } else {
        setError("Invalid student ID or password")
      }
    } else {
      const admin = mockAdmins.find((a) => a.adminId === adminId && a.password === password)
      if (admin) {
        onLogin(admin)
      } else {
        setError("Invalid admin ID or password")
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">College Portal</CardTitle>
            <CardDescription className="text-gray-600 mt-2">Sign in to access your account</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-sm font-medium text-gray-700">
                    Student ID
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="studentId"
                      type="text"
                      placeholder="Enter your student ID"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In as Student"
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">Demo Student Credentials:</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>Student ID: STU001, Password: password123</div>
                  <div>Student ID: STU002, Password: password123</div>
                  <div>Student ID: STU003, Password: password123</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="adminId" className="text-sm font-medium text-gray-700">
                    Admin ID
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="adminId"
                      type="text"
                      placeholder="Enter your admin ID"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminPassword" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="adminPassword"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In as Admin"
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800 font-medium mb-2">Demo Admin Credentials:</p>
                <div className="text-xs text-purple-700 space-y-1">
                  <div>Admin ID: ADMIN001, Password: admin123</div>
                  <div>Admin ID: ADMIN002, Password: admin123</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
