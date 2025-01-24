import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
//import strings from "@/strings.json"

export function AdminSidebar() {
  return (
    <aside className="fixed left-3 md:left-2 lg:left-5 top-15 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto bg-background px-4 py-6 md:sticky md:block md:w-[280px] lg:w-[300px]">
      <div className="flex items-center justify-between mb-8">
        <Link href="/admin" className="text-4xl font-bold text-primary">BlogPop</Link>
        <span className="text-sm text-muted-foreground">v1.0.0</span>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/posts" className="text-sm text-muted-foreground hover:text-primary">
                Posts
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="text-sm text-muted-foreground hover:text-primary">
                Users
              </Link>
            </li>
            <li>
              <Link href="/admin/logout" className="text-sm text-muted-foreground hover:text-primary">
                Logout
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>
    </aside>
  )
}

