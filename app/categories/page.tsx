"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow, format } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import strings from "@/strings.json"

interface Category {
  id: number
  name: string
  description: string
  slug: string
}

interface Post {
  category: string
  date: number
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3001/api/categories/fetchList").then((res) => res.json()),
      fetch("http://localhost:3001/api/posts/fetchList").then((res) => res.json()),
    ])
      .then(([categoriesData, postsData]) => {
        setCategories(categoriesData.categories)
        setPosts(postsData.posts)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[!] Error fetching data:", error)
        setError("Failed to fetch data")
        setLoading(false)
      })
  }, [])

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    const now = new Date()
    if (date.getFullYear() !== now.getFullYear()) {
      return format(date, "d MMMM, yyyy")
    } else {
      return formatDistanceToNow(date, { addSuffix: true })
    }
  }

  const getCategoryPostCount = (categoryName: string) => {
    return posts.filter((post) => post.category === categoryName).length
  }

  const getLastUpdatedDate = (categoryName: string) => {
    const categoryPosts = posts.filter((post) => post.category === categoryName)
    if (categoryPosts.length === 0) return null
    return Math.max(...categoryPosts.map((post) => post.date))
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">{strings.categoriesHeader}</h1>
      {loading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-slate-800 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const postCount = getCategoryPostCount(category.name)
            const lastUpdated = getLastUpdatedDate(category.name)
            return (
              <Card
                key={category.id}
                className="flex flex-col justify-between border-border/40 hover:border-border/60 transition-colors"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-primary">{category.name}</CardTitle>
                    <Badge variant="secondary" className="ml-2">
                      {postCount}{" "}
                      {postCount === 1 ? strings.categoriesPostUnitSingle : strings.categoriesPostUnitPlural}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {lastUpdated && (
                    <p className="text-sm text-muted-foreground">
                      {strings.categoriesLastUpdatedLabel} {formatDate(lastUpdated)}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {strings.categoriesViewPostsFromLinkText}
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

