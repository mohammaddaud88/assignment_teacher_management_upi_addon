"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Calendar, BookOpen, Settings, BarChart3, FileText, Clock, Menu, X, CreditCard } from "lucide-react"

const navigation = [
  { name: "Teachers", href: "/teachers", icon: Users },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Time Tracking", href: "/time-tracking", icon: Clock },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Payments", href: "/payments", icon: CreditCard },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)



  return (
    <div className="relative">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-slate-900 text-white transition-all duration-300",
          "w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          "sm:translate-x-0 sm:static sm:inset-auto",
          className,
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            {!isCollapsed && <h2 className="text-xl font-bold text-white">EduManage</h2>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:bg-slate-800 p-2 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-4 overflow-y-auto">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-white hover:bg-slate-800",
                      isActive && "bg-slate-800 text-white",
                      isCollapsed && "px-2",
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                    {!isCollapsed && item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
      </div>
      <div className="fixed top-4 left-4 z-50 sm:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-slate-900 text-white hover:bg-slate-800 hover:text-white p-2 rounded-lg shadow-lg"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
