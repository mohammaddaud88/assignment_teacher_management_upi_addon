"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, BookOpen, Clock } from "lucide-react"
import { Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Mail, Phone, MapPin, DollarSign, Plus, Save, X } from "lucide-react"
import type { TeacherProfile } from "@/lib/types"

interface TeacherProfileProps {
  teacher: TeacherProfile
}

export function TeacherProfileComponent({ teacher }: TeacherProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTeacher, setEditedTeacher] = useState(teacher)

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Saving teacher data:", editedTeacher)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTeacher(teacher)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.name}`} />
                <AvatarFallback>
                  {teacher.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{teacher.name}</h1>
                <p className="text-muted-foreground">Teacher ID: {teacher.teacherId}</p>
              </div>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"}>
              {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 rounded-lg">
          <TabsTrigger value="details" className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Details</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="qualifications" className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Qualifications</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="history" className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>History</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="bg-card/80 border border-border/50">
              <CardHeader className="pb-0">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedTeacher.name}
                      onChange={(e) => setEditedTeacher({ ...editedTeacher, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm">{teacher.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  {isEditing ? (
                    <Input
                      id="birthDate"
                      type="date"
                      value={editedTeacher.birthDate}
                      onChange={(e) => setEditedTeacher({ ...editedTeacher, birthDate: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{new Date(teacher.birthDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedTeacher.email}
                      onChange={(e) => setEditedTeacher({ ...editedTeacher, email: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{teacher.email}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedTeacher.phone}
                      onChange={(e) => setEditedTeacher({ ...editedTeacher, phone: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{teacher.phone}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p>{teacher.address.street}</p>
                      <p>{teacher.address.city}</p>
                      <p>{teacher.address.country}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="qualifications" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Private Qualifications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Private Qualifications</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teacher.qualifications
                    .filter((q) => q.type === "private")
                    .map((qualification) => (
                      <div key={qualification.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{qualification.name}</p>
                          <Badge variant="secondary">Private</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">${qualification.rate}/hr</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Group Qualifications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Group Qualifications</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teacher.qualifications
                    .filter((q) => q.type === "group")
                    .map((qualification) => (
                      <div key={qualification.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{qualification.name}</p>
                          <Badge variant="outline">Group</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">${qualification.rate}/hr</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklySchedule 
                schedule={teacher.schedule.map(slot => ({
                  day: slot.day,
                  time: `${slot.startTime} - ${slot.endTime}`,
                  type: slot.type === "scheduled" ? "class" : "available",
                  status: slot.type
                }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teaching History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Teaching history and performance metrics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ScheduleItem {
  day: string
  time: string
  type: string
  status: string
}

function WeeklySchedule({ schedule }: { schedule: ScheduleItem[] }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const timeSlots = [
    "7:30am",
    "8am",
    "8:30am",
    "9am",
    "9:30am",
    "10am",
    "10:30am",
    "11am",
    "11:30am",
    "12pm",
    "12:30pm",
    "1pm",
    "1:30pm",
    "2pm",
    "2:30pm",
    "3pm",
    "3:30pm",
    "4pm",
    "4:30pm",
    "5pm",
    "5:30pm",
    "6pm",
  ]

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-8 gap-1 min-w-[800px]">
        {/* Header */}
        <div className="p-2 font-medium text-center">Time</div>
        {days.map((day) => (
          <div key={day} className="p-2 font-medium text-center bg-slate-50 rounded">
            {day}
          </div>
        ))}

        {/* Time slots */}
        {timeSlots.map((time) => (
          <div key={time} className="contents">
            <div className="p-2 text-sm text-muted-foreground text-right border-r">{time}</div>
            {days.map((day) => (
              <div key={`${day}-${time}`} className="p-1 border border-slate-200 min-h-[40px] relative">
                {schedule.map((item) => {
                  const [startTime, endTime] = item.time.split(' - ')
                  if (item.day === day && startTime === time) {
                    return (
                      <div key={item.day + item.time} className="absolute inset-1 bg-green-200 rounded text-xs p-1 text-green-800">
                        {item.type} - {item.status} ({startTime} - {endTime})
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
