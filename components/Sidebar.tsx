import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import strings from "@/strings.json"

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

const uniqueCategories = Array.from(new Set(posts.map(post => post.category)));
const latestPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

export function Sidebar() {
  return (
    <aside className="fixed left-3 md:left-2 lg:left-5 top-15 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto bg-background px-4 py-6 md:sticky md:block md:w-[280px] lg:w-[300px]">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-4xl font-bold text-primary">{process.env.BLOG_NAME || 'BlogPop'}</Link>
      </div>
      <div className="flex flex-1 items-center justify-start space-x-2 md:justify-center">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Input
              placeholder="Search posts..."
              className="h-9 mb-8 w-full md:w-[250px] lg:w-[270px]"
            />
          </div>
        </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{strings.recentPostsLabelSidebar}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {latestPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{strings.categoriesLabelSidebar}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {uniqueCategories.map((category) => (
              <li key={category}>
                <Link
                  href={`/categories/${category.toLowerCase()}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </aside>
  )
}

