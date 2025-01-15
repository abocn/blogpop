import './globals.css'
import { cn } from "@/lib/utils"
import { GeistSans } from 'geist/font/sans';
import { Navbar } from "@/components/Navbar"
import { Sidebar } from "@/components/Sidebar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en"
      className={cn(
        "bg-background font-sans antialiased",
        GeistSans.className
      )}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
            <Sidebar />
            <main className="relative flex w-full flex-col overflow-hidden px-6 pr-7 py-6 sm:px-8 sm:pr-13 md:px-14 md:pr-7 lg:px-16 lg:pr-11">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}

