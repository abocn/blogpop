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

export default function Categories() {
  const categories = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">{strings.categoriesHeader}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(categories).map(([category, count]) => (
          <Card key={category} className="flex flex-col justify-between border-border/40 hover:border-border/60 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl text-primary">{category}</CardTitle>
                <Badge variant="secondary" className="ml-2">
                  {count} {count === 1 ? strings.categoriesPostUnitSingle : strings.categoriesPostUnitPlural }
                </Badge>
              </div>
              <CardDescription className="mt-2">
                {strings.categoriesCardDescriptionPre} {category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {strings.categoriesLastUpdatedLabel}: {posts.find(post => post.category === category)?.date}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link
                href={`/categories/${category.toLowerCase()}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {strings.categoriesViewPostsFromLinkText}
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}