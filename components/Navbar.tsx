"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'
import { DialogTitle } from "@radix-ui/react-dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import strings from "@/strings.json"
import config from "@/config.json"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 hidden md:flex">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-primary",
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              )}
            >
              {strings.homeLinkTextNavbar}
            </Link>
            <Link
              href="/categories"
              className={cn(
                "transition-colors hover:text-primary",
                pathname?.startsWith("/categories")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {strings.categoriesLinkTextNavbar}
            </Link>
            <Link
              href="/admin"
              className={cn(
                "transition-colors hover:text-primary",
                pathname?.startsWith("/admin")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {strings.adminLinkTextNavbar}
            </Link>
            {config.personalWebsite && (
              <Link
                href={config.personalWebsiteUrl}
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname?.startsWith("/about")
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {config.personalWebsiteLinkText}
              </Link>
            )}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-4 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <DialogTitle>
              <VisuallyHidden>Menu</VisuallyHidden>
            </DialogTitle>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <MobileLink href="/" onOpenChange={() => {}}>
                  Home
                </MobileLink>
                <MobileLink href="/categories" onOpenChange={() => {}}>
                  Categories
                </MobileLink>
                <MobileLink href="/about" onOpenChange={() => {}}>
                  About
                </MobileLink>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-start space-x-2 md:justify-center">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Input
              placeholder="Search posts..."
              className="h-9 w-full md:hidden lg:hidden"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

interface MobileLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const pathname = usePathname()
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false)
      }}
      className={cn(
        "text-muted-foreground transition-colors hover:text-primary",
        pathname === href && "text-primary",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

