"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu } from "lucide-react"
import { useSidebar } from "@/context/SidebarContext"
import strings from "@/strings.json"
import config from "@/config.json"

export function Navbar() {
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 hidden md:flex">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-primary",
                pathname === "/" ? "text-primary" : "text-muted-foreground",
              )}
            >
              {strings.homeLinkTextNavbar}
            </Link>
            <Link
              href="/categories"
              className={cn(
                "transition-colors hover:text-primary",
                pathname?.startsWith("/categories") ? "text-primary" : "text-muted-foreground",
              )}
            >
              {strings.categoriesLinkTextNavbar}
            </Link>
            {config.personalWebsite && (
              <Link href={config.personalWebsiteUrl} className="transition-colors text-muted-foreground hover:text-primary">
                {config.personalWebsiteLinkText}
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-start space-x-2 md:justify-center">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="md:hidden lg:hidden" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Input placeholder="Search posts on desktop..." className="h-9 w-full md:hidden lg:hidden" />
          </div>
        </div>
      </div>
    </header>
  )
}

