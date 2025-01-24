"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/navigation/Sidebar"
import { AdminSidebar } from "@/components/navigation/sidebar/AdminSidebar"
import { MobileSidebar } from "@/components/navigation/sidebar/MobileSidebar"
import { MobileAdminSidebar } from "@/components/navigation/sidebar/MobileAdminSidebar"

export default function ClientSideNav() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const isAdmin = pathname.includes("admin") && !pathname.includes("login")

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (isMobile) {
    return isAdmin ? <MobileAdminSidebar /> : <MobileSidebar />
  }
  return isAdmin ? <AdminSidebar /> : <Sidebar />
}

