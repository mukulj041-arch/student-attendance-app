"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  CheckCircle,
  Calendar,
  ClipboardCheck,
  Timer,
  User,
  Settings,
  Bell,
  Shield,
  Palette,
  LogOut,
  X,
  BookOpen,
  Square,
  Play,
  Clock,
  MapPin,
  Users,
  TrendingUp,
  Activity,
  Target,
} from "lucide-react"

interface StudentDashboardProps {
  user: any
  onLogout: () => void
}

// Mock data for events and attendance
const mockEvents = [
  {
    id: 1,
    title: "Computer Science Seminar",
    date: "2024-01-15",
    time: "10:00 AM",
    location: "Auditorium A",
    type: "Academic",
    description: "Latest trends in AI and Machine Learning",
  },
  {
    id: 2,
    title: "Annual Sports Meet",
    date: "2024-01-20",
    time: "9:00 AM",
    location: "Sports Complex",
    type: "Sports",
    description: "Inter-department sports competition",
  },
  {
    id: 3,
    title: "Career Fair 2024",
    date: "2024-01-25",
    time: "11:00 AM",
    location: "Main Hall",
    type: "Career",
    description: "Meet with top recruiters and companies",
  },
]

const mockAttendance = [
  { date: "2024-01-08", subject: "Data Structures", status: "present" },
  { date: "2024-01-08", subject: "Database Systems", status: "present" },
  { date: "2024-01-09", subject: "Web Development", status: "absent" },
  { date: "2024-01-10", subject: "Data Structures", status: "present" },
  { date: "2024-01-10", subject: "Software Engineering", status: "present" },
]

const todaysClasses = [
  {
    id: 1,
    subject: "Data Structures",
    time: "9:00 AM - 10:30 AM",
    room: "Room 101",
    professor: "Dr. Smith",
    status: "upcoming", // upcoming, ongoing, completed
  },
  {
    id: 2,
    subject: "Database Systems",
    time: "11:00 AM - 12:30 PM",
    room: "Room 205",
    professor: "Prof. Johnson",
    status: "ongoing",
  },
  {
    id: 3,
    subject: "Web Development",
    time: "2:00 PM - 3:30 PM",
    room: "Lab 301",
    professor: "Dr. Wilson",
    status: "upcoming",
  },
  {
    id: 4,
    subject: "Software Engineering",
    time: "4:00 PM - 5:30 PM",
    room: "Room 102",
    professor: "Prof. Davis",
    status: "upcoming",
  },
]

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<"attendance" | "events" | "mark-attendance" | "punch-attendance">(
    "attendance",
  )
  const [markedAttendance, setMarkedAttendance] = useState<{ [key: number]: boolean }>({})
  const [showSettings, setShowSettings] = useState(false)
  const [settingsTab, setSettingsTab] = useState<"profile" | "notifications" | "privacy" | "preferences">("profile")
  const [punchStatus, setPunchStatus] = useState<"out" | "in">("out")
  const [punchTime, setPunchTime] = useState<string | null>(null)
  const [totalHours, setTotalHours] = useState<string>("0h 0m 0s")
  const [punchHistory, setPunchHistory] = useState<
    Array<{
      date: string
      punchIn: string
      punchOut: string | null
      duration: string
    }>
  >([
    { date: "2024-01-10", punchIn: "8:30:15 AM", punchOut: "4:45:30 PM", duration: "8h 15m 15s" },
    { date: "2024-01-09", punchIn: "8:45:22 AM", punchOut: "5:00:45 PM", duration: "8h 15m 23s" },
    { date: "2024-01-08", punchIn: "8:20:10 AM", punchOut: "4:30:55 PM", duration: "8h 10m 45s" },
  ])

  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email || "student@college.edu",
    phone: user.phone || "+1 (555) 123-4567",
    address: user.address || "123 College Street, Campus City, CC 12345",
    bio: user.bio || "Computer Science student passionate about technology and innovation.",
    emergencyContact: user.emergencyContact || "Jane Doe - +1 (555) 987-6543",
  })

  const [settingsData, setSettingsData] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      attendance: true,
      events: true,
      grades: true,
    },
    privacy: {
      profileVisible: true,
      attendanceVisible: false,
      contactVisible: true,
    },
    preferences: {
      theme: "light",
      language: "English",
      timezone: "UTC-5",
      dateFormat: "MM/DD/YYYY",
    },
  })

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const savedPunchStatus = localStorage.getItem(`punch_status_${user.studentId}`)
    const savedPunchTime = localStorage.getItem(`punch_time_${user.studentId}`)

    if (savedPunchStatus) {
      setPunchStatus(savedPunchStatus as "out" | "in")
    }
    if (savedPunchTime) {
      setPunchTime(savedPunchTime)
    }
  }, [user.studentId])

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  useEffect(() => {
    if (punchStatus === "in" && punchTime) {
      const interval = setInterval(() => {
        const punchInTime = new Date(punchTime)
        const now = new Date()
        const diff = now.getTime() - punchInTime.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTotalHours(`${hours}h ${minutes}m ${seconds}s`)
      }, 1000) // Update every second instead of every minute

      return () => clearInterval(interval)
    }
  }, [punchStatus, punchTime])

  const attendanceStats = {
    total: mockAttendance.length,
    present: mockAttendance.filter((a) => a.status === "present").length,
    absent: mockAttendance.filter((a) => a.status === "absent").length,
  }

  const attendancePercentage = Math.round((attendanceStats.present / attendanceStats.total) * 100)

  const handleMarkAttendance = (classId: number) => {
    setMarkedAttendance((prev) => ({
      ...prev,
      [classId]: true,
    }))
  }

  const handlePunch = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })

    if (punchStatus === "out") {
      // Punch In
      setPunchStatus("in")
      setPunchTime(now.toISOString())
      localStorage.setItem(`punch_status_${user.studentId}`, "in")
      localStorage.setItem(`punch_time_${user.studentId}`, now.toISOString())
    } else {
      // Punch Out
      const punchInTime = new Date(punchTime!)
      const diff = now.getTime() - punchInTime.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      const duration = `${hours}h ${minutes}m ${seconds}s`

      // Add to history
      const newEntry = {
        date: now.toLocaleDateString(),
        punchIn: punchInTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        punchOut: timeString,
        duration: duration,
      }

      setPunchHistory((prev) => [newEntry, ...prev])
      setPunchStatus("out")
      setPunchTime(null)
      setTotalHours("0h 0m 0s")

      localStorage.removeItem(`punch_status_${user.studentId}`)
      localStorage.removeItem(`punch_time_${user.studentId}`)
    }
  }

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettingsData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettingsData((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }))
  }

  const handlePreferenceChange = (key: string, value: string) => {
    setSettingsData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)} className="p-2">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={onLogout} className="flex items-center gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Attendance</p>
                  <p className="text-2xl font-bold text-blue-900">{attendancePercentage}%</p>
                  <p className="text-xs text-blue-700 mt-1">
                    {attendanceStats.present} of {attendanceStats.total} classes
                  </p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Current Status</p>
                  <p className="text-2xl font-bold text-green-900">{punchStatus === "in" ? "Active" : "Inactive"}</p>
                  <p className="text-xs text-green-700 mt-1">
                    {punchStatus === "in"
                      ? `Since ${punchTime ? new Date(punchTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true }) : ""}`
                      : "Not punched in"}
                  </p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <Activity className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Days Present</p>
                  <p className="text-2xl font-bold text-purple-900">{attendanceStats.present}</p>
                  <p className="text-xs text-purple-700 mt-1">This month</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-full">
                  <CheckCircle className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Today's Hours</p>
                  <p className="text-2xl font-bold text-orange-900">{totalHours}</p>
                  <p className="text-xs text-orange-700 mt-1">
                    {punchStatus === "in" ? "Currently active" : "Completed"}
                  </p>
                </div>
                <div className="p-3 bg-orange-200 rounded-full">
                  <Target className="h-6 w-6 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          <Button
            variant={activeTab === "attendance" ? "default" : "ghost"}
            onClick={() => setActiveTab("attendance")}
            className="rounded-b-none whitespace-nowrap"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Attendance
          </Button>
          <Button
            variant={activeTab === "mark-attendance" ? "default" : "ghost"}
            onClick={() => setActiveTab("mark-attendance")}
            className="rounded-b-none whitespace-nowrap"
          >
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
          <Button
            variant={activeTab === "punch-attendance" ? "default" : "ghost"}
            onClick={() => setActiveTab("punch-attendance")}
            className="rounded-b-none whitespace-nowrap"
          >
            <Timer className="h-4 w-4 mr-2" />
            Punch Attendance
          </Button>
          <Button
            variant={activeTab === "events" ? "default" : "ghost"}
            onClick={() => setActiveTab("events")}
            className="rounded-b-none whitespace-nowrap"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </Button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "attendance" && (
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Recent Attendance</CardTitle>
                <CardDescription>Your attendance record for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAttendance.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-full ${record.status === "present" ? "bg-green-100" : "bg-red-100"}`}
                        >
                          {record.status === "present" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{record.subject}</p>
                          <p className="text-sm text-gray-600">{record.date}</p>
                        </div>
                      </div>
                      <Badge
                        variant={record.status === "present" ? "default" : "destructive"}
                        className={record.status === "present" ? "bg-green-100 text-green-800" : ""}
                      >
                        {record.status === "present" ? "Present" : "Absent"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "mark-attendance" && (
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Mark Today's Attendance</CardTitle>
                <CardDescription>Mark yourself present for your classes today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysClasses.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-full ${
                            classItem.status === "ongoing"
                              ? "bg-blue-100"
                              : classItem.status === "completed"
                                ? "bg-gray-100"
                                : "bg-yellow-100"
                          }`}
                        >
                          <BookOpen
                            className={`h-4 w-4 ${
                              classItem.status === "ongoing"
                                ? "text-blue-600"
                                : classItem.status === "completed"
                                  ? "text-gray-600"
                                  : "text-yellow-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{classItem.subject}</p>
                          <p className="text-sm text-gray-600">
                            {classItem.time} • {classItem.room}
                          </p>
                          <p className="text-xs text-gray-500">{classItem.professor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={
                            classItem.status === "ongoing"
                              ? "border-blue-200 text-blue-700"
                              : classItem.status === "completed"
                                ? "border-gray-200 text-gray-700"
                                : "border-yellow-200 text-yellow-700"
                          }
                        >
                          {classItem.status === "ongoing"
                            ? "Ongoing"
                            : classItem.status === "completed"
                              ? "Completed"
                              : "Upcoming"}
                        </Badge>
                        {markedAttendance[classItem.id] ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Marked Present
                          </Badge>
                        ) : (
                          <Button
                            onClick={() => handleMarkAttendance(classItem.id)}
                            disabled={classItem.status === "completed"}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <ClipboardCheck className="h-4 w-4 mr-2" />
                            Mark Present
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium mb-1">Note:</p>
                  <p className="text-xs text-blue-700">
                    You can only mark attendance for ongoing classes. Make sure you're physically present in the
                    classroom before marking attendance.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "punch-attendance" && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Current Time</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {currentTime.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {currentTime.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Punch In/Out Card */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Time Punch</CardTitle>
                  <CardDescription>Punch in when you arrive and punch out when you leave</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-full ${punchStatus === "in" ? "bg-green-100" : "bg-gray-100"}`}>
                        <Timer className={`h-8 w-8 ${punchStatus === "in" ? "text-green-600" : "text-gray-600"}`} />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          Current Status: {punchStatus === "in" ? "Punched In" : "Punched Out"}
                        </p>
                        {punchStatus === "in" && punchTime && (
                          <p className="text-sm text-gray-600">
                            Since:{" "}
                            {new Date(punchTime).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        )}
                        {punchStatus === "in" && (
                          <p className="text-sm font-medium text-blue-600">Total Time: {totalHours}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={handlePunch}
                      size="lg"
                      className={`flex items-center gap-2 ${
                        punchStatus === "in" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {punchStatus === "in" ? (
                        <>
                          <Square className="h-5 w-5" />
                          Punch Out
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5" />
                          Punch In
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Punch History */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Punch History</CardTitle>
                  <CardDescription>Your recent punch in/out records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {punchHistory.map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{record.date}</p>
                            <p className="text-sm text-gray-600">
                              In: {record.punchIn} • Out: {record.punchOut || "Not punched out"}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-blue-200 text-blue-700">
                          {record.duration}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-4">
              {mockEvents.map((event, index) => {
                const pastelColors = [
                  "bg-gradient-to-br from-pink-50 to-rose-100 border-pink-200",
                  "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200",
                  "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200",
                  "bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200",
                  "bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200",
                ]
                const cardColor = pastelColors[index % pastelColors.length]

                return (
                  <Card key={event.id} className={`shadow-sm border ${cardColor}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-gray-700">{event.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {event.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" className="shrink-0 bg-white/70 backdrop-blur-sm hover:bg-white/90">
                          <Users className="h-4 w-4 mr-2" />
                          Register
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Settings</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)} className="p-2">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex">
              {/* Settings Navigation */}
              <div className="w-64 border-r bg-gray-50 p-4">
                <div className="space-y-2">
                  <Button
                    variant={settingsTab === "profile" ? "default" : "ghost"}
                    onClick={() => setSettingsTab("profile")}
                    className="w-full justify-start"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant={settingsTab === "notifications" ? "default" : "ghost"}
                    onClick={() => setSettingsTab("notifications")}
                    className="w-full justify-start"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button
                    variant={settingsTab === "privacy" ? "default" : "ghost"}
                    onClick={() => setSettingsTab("privacy")}
                    className="w-full justify-start"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy
                  </Button>
                  <Button
                    variant={settingsTab === "preferences" ? "default" : "ghost"}
                    onClick={() => setSettingsTab("preferences")}
                    className="w-full justify-start"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Preferences
                  </Button>
                </div>
              </div>

              {/* Settings Content */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {settingsTab === "profile" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                      <p className="text-gray-600 mb-6">Update your personal information and contact details</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20 bg-blue-600">
                        <AvatarFallback className="text-white font-semibold text-xl">
                          {profileData.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm">
                          Change Photo
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => handleProfileUpdate("name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileUpdate("email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleProfileUpdate("phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergency">Emergency Contact</Label>
                        <Input
                          id="emergency"
                          value={profileData.emergencyContact}
                          onChange={(e) => handleProfileUpdate("emergencyContact", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => handleProfileUpdate("address", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button variant="outline" onClick={() => setShowSettings(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                    </div>
                  </div>
                )}

                {settingsTab === "notifications" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                      <p className="text-gray-600 mb-6">Manage how you receive notifications</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={settingsData.notifications.email}
                          onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                        </div>
                        <Switch
                          checked={settingsData.notifications.push}
                          onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          checked={settingsData.notifications.sms}
                          onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-4">Notification Types</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Attendance Reminders</p>
                            <p className="text-sm text-gray-600">Get reminded to mark attendance</p>
                          </div>
                          <Switch
                            checked={settingsData.notifications.attendance}
                            onCheckedChange={(checked) => handleNotificationChange("attendance", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Event Updates</p>
                            <p className="text-sm text-gray-600">Notifications about upcoming events</p>
                          </div>
                          <Switch
                            checked={settingsData.notifications.events}
                            onCheckedChange={(checked) => handleNotificationChange("events", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Grade Updates</p>
                            <p className="text-sm text-gray-600">Get notified when grades are posted</p>
                          </div>
                          <Switch
                            checked={settingsData.notifications.grades}
                            onCheckedChange={(checked) => handleNotificationChange("grades", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === "privacy" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
                      <p className="text-gray-600 mb-6">Control who can see your information</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Profile Visibility</p>
                          <p className="text-sm text-gray-600">Allow others to view your profile</p>
                        </div>
                        <Switch
                          checked={settingsData.privacy.profileVisible}
                          onCheckedChange={(checked) => handlePrivacyChange("profileVisible", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Attendance Visibility</p>
                          <p className="text-sm text-gray-600">Show attendance status to classmates</p>
                        </div>
                        <Switch
                          checked={settingsData.privacy.attendanceVisible}
                          onCheckedChange={(checked) => handlePrivacyChange("attendanceVisible", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Contact Information</p>
                          <p className="text-sm text-gray-600">Allow others to see your contact details</p>
                        </div>
                        <Switch
                          checked={settingsData.privacy.contactVisible}
                          onCheckedChange={(checked) => handlePrivacyChange("contactVisible", checked)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === "preferences" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">App Preferences</h3>
                      <p className="text-gray-600 mb-6">Customize your app experience</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <select
                          id="theme"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={settingsData.preferences.theme}
                          onChange={(e) => handlePreferenceChange("theme", e.target.value)}
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <select
                          id="language"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={settingsData.preferences.language}
                          onChange={(e) => handlePreferenceChange("language", e.target.value)}
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <select
                          id="timezone"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={settingsData.preferences.timezone}
                          onChange={(e) => handlePreferenceChange("timezone", e.target.value)}
                        >
                          <option value="UTC-5">Eastern Time (UTC-5)</option>
                          <option value="UTC-6">Central Time (UTC-6)</option>
                          <option value="UTC-7">Mountain Time (UTC-7)</option>
                          <option value="UTC-8">Pacific Time (UTC-8)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <select
                          id="dateFormat"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={settingsData.preferences.dateFormat}
                          onChange={(e) => handlePreferenceChange("dateFormat", e.target.value)}
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
