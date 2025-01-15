import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
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

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">{strings.latestPostsHeader}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col justify-between border-border/40 hover:border-border/60 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl text-primary">{post.title}</CardTitle>
                <Badge variant="secondary" className="ml-2">
                  {post.category}
                </Badge>
              </div>
              <CardDescription className="mt-2">{post.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {strings.recentPostsPublishedOnLabel} {post.date}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link
                href={`/posts/${post.slug}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {strings.recentPostsReadMoreFromLinkText}
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

