'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import strings from "@/strings.json";

type Post = {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
};

export function Sidebar() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [uniqueCategories, setUniqueCategories] = useState<{ name: string; slug: string }[]>([]);

  useEffect(() => {
    console.log("[i] Fetching post list...");
    fetch('http://localhost:3001/api/posts/fetchList')
      .then(response => response.json())
      .then(data => {
        if (!data.posts) {
          throw new Error('[!] Failed to fetch posts');
        }
        console.log("[✓] Fetched posts");
        setPosts(data.posts);
        setLoadingPosts(false);
      })
      .catch(error => {
        console.error(error);
        setError(`[!] Error fetching posts: ${error.message}`);
        setLoadingPosts(false);
      });

    console.log("[i] Fetching category list...");
    fetch('http://localhost:3001/api/categories/fetchList')
      .then(response => response.json())
      .then(data => {
        if (!data.categories) {
          throw new Error('Failed to fetch categories');
        }
        console.log("[✓] Fetched categories");
        const categories = data.categories.map((cat: { name: string, slug: string }) => ({
          name: cat.name,
          slug: cat.slug,
        }));
        setUniqueCategories(categories);
        setLoadingCategories(false);
      })
      .catch(error => {
        console.error(error);
        setError(`[!] Error fetching categories: ${error.message}`);
        setLoadingCategories(false);
      });
  }, []);

  return (
    <aside className="fixed left-3 md:left-2 lg:left-5 top-15 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto bg-background px-4 py-6 md:sticky md:block md:w-[280px] lg:w-[300px]">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-4xl font-bold text-primary">{process.env.NEXT_PUBLIC_BLOG_NAME || 'BlogPop'}</Link>
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
          {loadingPosts ? (
            <div className="flex items-center justify-center h-[10vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-slate-800 border-white"></div>
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : posts.length === 0 ? (
            <div>No recent posts available.</div>
          ) : (
            <ul className="space-y-2">
              {posts
                .sort((a, b) => parseInt(b.date) - parseInt(a.date))
                .slice(0, 3)
                .map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary"
                      aria-label={`View post titled ${post.title}`}
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{strings.categoriesLabelSidebar}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingCategories ? (
            <div className="flex items-center justify-center h-[10vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-slate-800 border-white"></div>
            </div>
          ) : uniqueCategories.length === 0 ? (
            <div>No categories available.</div>
          ) : (
            <ul className="space-y-2">
              {uniqueCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                    aria-label={`View posts in category ${category.name}`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
