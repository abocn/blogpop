"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useSidebar } from "@/context/SidebarContext"

export function MobileAdminSidebar() {
  const { isOpen, toggleSidebar } = useSidebar()

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto bg-background px-4 py-6 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between mb-6 mt-12">
        <Link href="/" className="text-4xl font-bold text-primary">
          {process.env.BLOG_NAME || "BlogPop"}
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <X className="h-6 w-6" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      <nav className="flex flex-col space-y-4">
        <Link href="/admin" className="text-lg text-muted-foreground hover:text-primary">
          Dashboard
        </Link>
        <Link href="/admin/posts" className="text-lg text-muted-foreground hover:text-primary">
          Posts
        </Link>
        <Link href="/admin/users" className="text-lg text-muted-foreground hover:text-primary">
          Users
        </Link>
        <Link href="/admin/logout" className="text-lg text-muted-foreground hover:text-primary">
          Logout
        </Link>
      </nav>
    </aside>
  )
}

