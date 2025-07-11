export interface Teacher {
  id: string
  name: string
  teacherId: string
  birthDate: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    country: string
  }
}

export interface Qualification {
  id: string
  name: string
  rate: number
  type: "private" | "group"
}

export interface ScheduleSlot {
  id: string
  day: string
  startTime: string
  endTime: string
  subject?: string
  type: "scheduled" | "available"
}

export interface TeacherProfile extends Teacher {
  qualifications: Qualification[]
  schedule: ScheduleSlot[]
}
