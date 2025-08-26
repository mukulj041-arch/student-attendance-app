"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Calendar, BarChart3, LogOut, Plus, Search, CheckCircle, Edit, Trash2, Shield } from "lucide-react"

interface AdminDashboardProps {
  user: any
  onLogout: () => void
}

// Mock data
const mockStudents = [
  {
    id: "1",
    studentId: "STU001",
    name: "Alice Johnson",
    course: "Computer Science",
    year: "3rd Year",
    attendanceRate: 92,
    totalClasses: 25,
    presentClasses: 23,
  },
  {
    id: "2",
    studentId: "STU002",
    name: "Bob Smith",
    course: "Engineering",
    year: "2nd Year",
    attendanceRate: 88,
    totalClasses: 20,
    presentClasses: 18,
  },
  {
    id: "3",
    studentId: "STU003",
    name: "Carol Davis",
    course: "Business",
    year: "4th Year",
    attendanceRate: 95,
    totalClasses: 22,
    presentClasses: 21,
  },
]

const initialEvents = [
  {
    id: 1,
    title: "Computer Science Seminar",
    date: "2024-01-15",
    time: "10:00 AM",
    location: "Auditorium A",
    type: "Academic",
    description: "Latest trends in AI and Machine Learning",
    registrations: 45,
  },
  {
    id: 2,
    title: "Annual Sports Meet",
    date: "2024-01-20",
    time: "9:00 AM",
    location: "Sports Complex",
    type: "Sports",
    description: "Inter-department sports competition",
    registrations: 120,
  },
  {
    id: 3,
    title: "Career Fair 2024",
    date: "2024-01-25",
    time: "11:00 AM",
    location: "Main Hall",
    type: "Career",
    description: "Meet with top recruiters and companies",
    registrations: 89,
  },
]

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "events" | "reports">("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [events, setEvents] = useState(initialEvents)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    type: "Academic",
    description: "",
  })

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time && newEvent.location) {
      const eventToAdd = {
        ...newEvent,
        id: events.length + 1,
        registrations: 0,
      }
      setEvents([...events, eventToAdd])
      setNewEvent({
        title: "",
        date: "",
        time: "",
        location: "",
        type: "Academic",
        description: "",
      })
      setShowAddEvent(false)
    }
  }

  const handleEditEvent = (event: any) => {
    setEditingEvent(event)
    setNewEvent({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      description: event.description,
    })
    setShowAddEvent(true)
  }

  const handleUpdateEvent = () => {
    if (editingEvent && newEvent.title && newEvent.date && newEvent.time && newEvent.location) {
      const updatedEvents = events.map((event) => (event.id === editingEvent.id ? { ...event, ...newEvent } : event))
      setEvents(updatedEvents)
      setEditingEvent(null)
      setNewEvent({
        title: "",
        date: "",
        time: "",
        location: "",
        type: "Academic",
        description: "",
      })
      setShowAddEvent(false)
    }
  }

  const handleDeleteEvent = (eventId: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== eventId))
    }
  }

  const handleCancelEdit = () => {
    setEditingEvent(null)
    setNewEvent({
      title: "",
      date: "",
      time: "",
      location: "",
      type: "Academic",
      description: "",
    })
    setShowAddEvent(false)
  }

  const overallAttendanceRate = Math.round(
    mockStudents.reduce((sum, student) => sum + student.attendanceRate, 0) / mockStudents.length,
  )

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 bg-purple-600">
              <AvatarFallback className="text-white font-semibold">
                <Shield className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">
                {user.name} • {user.role} • {user.department}
              </p>
            </div>
          </div>
          <Button onClick={onLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStudents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overall Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">{overallAttendanceRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Events</p>
                  <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Event Registrations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events.reduce((sum, event) => sum + event.registrations, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 bg-white rounded-t-lg px-4">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            onClick={() => setActiveTab("overview")}
            className="rounded-b-none"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === "students" ? "default" : "ghost"}
            onClick={() => setActiveTab("students")}
            className="rounded-b-none"
          >
            <Users className="h-4 w-4 mr-2" />
            Students
          </Button>
          <Button
            variant={activeTab === "events" ? "default" : "ghost"}
            onClick={() => setActiveTab("events")}
            className="rounded-b-none"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </Button>
          <Button
            variant={activeTab === "reports" ? "default" : "ghost"}
            onClick={() => setActiveTab("reports")}
            className="rounded-b-none"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest student attendance and event registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Alice Johnson marked attendance</p>
                        <p className="text-sm text-gray-600">Data Structures - 2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">New event registration</p>
                        <p className="text-sm text-gray-600">Career Fair 2024 - 3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "students" && (
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Student Management</CardTitle>
                  <CardDescription>View and manage student attendance records</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full md:w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 bg-blue-600">
                        <AvatarFallback className="text-white text-sm">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">
                          {student.studentId} • {student.course} • {student.year}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{student.attendanceRate}%</p>
                        <p className="text-xs text-gray-600">
                          {student.presentClasses}/{student.totalClasses} classes
                        </p>
                      </div>
                      <Badge
                        variant={
                          student.attendanceRate >= 90
                            ? "default"
                            : student.attendanceRate >= 75
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          student.attendanceRate >= 90
                            ? "bg-green-100 text-green-800"
                            : student.attendanceRate >= 75
                              ? "bg-yellow-100 text-yellow-800"
                              : ""
                        }
                      >
                        {student.attendanceRate >= 90 ? "Excellent" : student.attendanceRate >= 75 ? "Good" : "Poor"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "events" && (
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Event Management</CardTitle>
                  <CardDescription>Create and manage college events</CardDescription>
                </div>
                <Button onClick={() => setShowAddEvent(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddEvent && (
                <Card className="mb-6 border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">{editingEvent ? "Edit Event" : "Add New Event"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Event Title</Label>
                        <Input
                          id="title"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          placeholder="Enter event title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Event Type</Label>
                        <Select
                          value={newEvent.type}
                          onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Academic">Academic</SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                            <SelectItem value="Career">Career</SelectItem>
                            <SelectItem value="Cultural">Cultural</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                          placeholder="e.g., 10:00 AM"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                          placeholder="Enter location"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        placeholder="Enter event description"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={editingEvent ? handleUpdateEvent : handleAddEvent}>
                        {editingEvent ? "Update Event" : "Add Event"}
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <p className="text-gray-600">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {event.date} • {event.time}
                        </span>
                        <span>{event.location}</span>
                        <span>{event.registrations} registrations</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEvent(event)}
                        className="hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Attendance Reports</CardTitle>
                <CardDescription>Detailed attendance analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {mockStudents.filter((s) => s.attendanceRate >= 90).length}
                    </div>
                    <p className="text-sm text-green-700">Students with 90%+ attendance</p>
                  </div>
                  <div className="text-center p-6 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {mockStudents.filter((s) => s.attendanceRate >= 75 && s.attendanceRate < 90).length}
                    </div>
                    <p className="text-sm text-yellow-700">Students with 75-89% attendance</p>
                  </div>
                  <div className="text-center p-6 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {mockStudents.filter((s) => s.attendanceRate < 75).length}
                    </div>
                    <p className="text-sm text-red-700">Students with &lt;75% attendance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
