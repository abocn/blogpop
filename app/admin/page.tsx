import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import strings from "@/strings.json"
import { PlusCircle, UserPlus } from "lucide-react"

const posts = [
  {
    id: 1,
    title: "Sample Post 1",
    description: "Description",
    date: "2025-01-14",
    category: "Example Category 1",
    slug: "sample-post-1",
  },
  {
    id: 2,
    title: "Sample Post 2",
    description: "Description",
    date: "2025-01-14",
    category: "Example Category 1",
    slug: "sample-post-2",
  },
  {
    id: 3,
    title: "Sample Post 3",
    description: "Description",
    date: "2025-01-14",
    category: "Example Category 2",
    slug: "sample-post-3",
  },
  {
    id: 4,
    title: "Sample Post 4",
    description: "Description",
    date: "2025-01-14",
    category: "Example Category 2",
    slug: "sample-post-4",
  },
]

export default function Admin() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">{strings.adminHeader}</h1>
      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl text-primary">{strings.totalPostsCardTitle}</CardTitle>
              <span className="text-4xl font-bold text-primary ml-2">
                {posts.length}
              </span>
            </div>
          </CardHeader>
        </Card>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/admin/post">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </a>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/admin/users/new">
                <UserPlus className="mr-2 h-4 w-4" />
                New User
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

