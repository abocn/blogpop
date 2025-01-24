'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import strings from "@/strings.json"
import { formatDistanceToNow, format } from 'date-fns'

export default function CategorySlug() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('Category View'); // TODO: needs a better title
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[i] Fetching post list...");
    (async () => {
      try {
        const catReq = await fetch(`http://localhost:3001/api/categories/fetchList`, {
          method: 'GET',
        });

        const postReq = await fetch(`http://localhost:3001/api/posts/fetchList`, {
          method: 'GET',
        });

        if (!catReq.ok) {
          throw new Error(`Failed to fetch category list: ${catReq.status}`);
        }
        if (!postReq.ok) {
          throw new Error(`Failed to fetch post list: ${postReq.status}`);
        }

        const catData = await catReq.json();
        const postData = await postReq.json();

        if (!catData) {
          setError('Failed to fetch category list');
        } else {
          console.log("[✓] Fetched categories");
          const slug = window.location.pathname.split('/').slice(-1)[0];
          const category = catData.categories.find((cat: { slug: string }) => cat.slug === slug);
          if (category) {
            console.log(`[✓] Found category: ${category.name}`);
            setCategory(category.name);
            if (postData.success === false) {
              if (postData.message) {
                throw new Error(postData.message);
              } else {
                throw new Error('Unknown error occurred');
              }
            } else {
              const sortedPosts = postData.posts.sort((a, b) => b.date - a.date);
              setPosts(sortedPosts);
            }
          } else {
            setError('Could not find requested category');
            throw new Error(`Category with slug "${slug}" not found`);
          }
        }
      } catch (error) {
        console.error('[!] Error fetching post list:', error);
        setError('Failed to fetch post list. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    if (date.getFullYear() !== now.getFullYear()) {
      return format(date, 'MM/DD/YYYY');
    } else {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  };

  return (
    <div className="space-y-8">
      {!loading && <h1 className="text-4xl font-bold text-primary">{category}</h1>}
      {loading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-slate-800 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col justify-between border-border/40 hover:border-border/60 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-primary">{post.title}</CardTitle>
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

