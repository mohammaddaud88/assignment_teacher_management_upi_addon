import { TeacherProfileComponent } from "@/components/teacher-profile"
import type { TeacherProfile } from "@/lib/types"
import Link from "next/link"

// Mock data based on the original interface
const mockTeacher: TeacherProfile = {
  id: "1",
  name: "Mr Suraj",
  teacherId: "T98701",
  birthDate: "2000-06-15",
  email: "mrsuraj@example.com",
  phone: "+916765678976",
  address: {
    street: "IIT Bombay",
    city: "Mumbai",
    country: "India",
  },
  qualifications: [
    { id: "1", name: "Vocal Contemporary", rate: 35.0, type: "private" },
    { id: "2", name: "Vocal Jazz", rate: 35.0, type: "private" },
    { id: "3", name: "Vocal Classical", rate: 35.0, type: "private" },
    { id: "4", name: "Vocal Pop", rate: 35.0, type: "private" },
    { id: "5", name: "Instrumental", rate: 40.0, type: "private" },
    { id: "6", name: "Group Vocal", rate: 25.0, type: "group" },
  ],
  schedule: [],
}

export default function Home() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teacher Management</h1>
            <p className="text-muted-foreground">Manage teacher profiles, qualifications, and schedules</p>
          </div>
          <Link href="/payments" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            View Payments
          </Link>
        </div>
      </div>
      <TeacherProfileComponent teacher={mockTeacher} />
    </div>
  )
}
