'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import strings from "@/strings.json"
import { formatDistanceToNow, format } from 'date-fns'

type Post = {
  id: number;
  title: string;
  description: string;
  category: string;
  date: number;
  slug: string;
};

export default function Home() {
  const [posts, setPosts] = useState<{ id: number; title: string; description: string; category: string; date: number; slug: string; }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[i] Fetching post list...");
    (async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/posts/fetchList`, {
          method: 'GET',
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch post list: ${res.status}`);
        }

        const data = await res.json();
        if (data.success === false) {
          if (data.message) {
            throw new Error(data.message);
          } else {
            throw new Error('Unknown error occurred');
          }
        } else {
          const sortedPosts: Post[] = data.posts.sort((a: Post, b: Post) => b.date - a.date);
          setPosts(sortedPosts);
        }
      } catch (error) {
        console.error('[!] Error fetching post list:', error);
        setError('Failed to fetch post list. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    if (date.getFullYear() !== now.getFullYear()) {
      return format(date, 'd MMMM, yyyy');
    } else {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">{strings.latestPostsHeader}</h1>
      {loading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-slate-800 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col justify-between">
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
                  {strings.recentPostsPublishedOnLabel} {formatDate(post.date)}
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
      )}
    </div>
  )
}

