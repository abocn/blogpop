'use client';

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import strings from "@/strings.json"
import { PlusCircle, UserPlus, CircleAlert } from "lucide-react"

export default function Home() {
  const [totalPosts, setTotalPosts] = useState(0);
  const [postCardError, setPostCardError] = useState(false);
  const [postCardLoading, setPostCardLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userCtCardError, setUserCtCardError] = useState(false);
  const [userCtCardLoading, setUserCtCardLoading] = useState(true);

  useEffect(() => {
    console.log("[i] Calculating post count...");
    (async () => {
      try {
        const username = document.cookie.split('; ').find(row => row.startsWith('username='))?.split('=')[1] || '';
        const key = document.cookie.split('; ').find(row => row.startsWith('key='))?.split('=')[1] || '';
        
        const res = await fetch(`http://localhost:3001/api/admin/posts/totalPosts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            key
          }),
          cache: 'no-store',
        });

        if (!res.ok) {
          alert('Failed to fetch total post count');
          setPostCardError(true);
          throw new Error(`Failed to fetch total post count: ${res.status}`);
        }

        const data = await res.json();
        if (data.success === false) {
          if (data.message) {
            alert(data.message);
            setPostCardError(true);
            setPostCardLoading(false);
            throw new Error(data.message);
          } else {
            alert('Unknown error occurred');
            setPostCardError(true);
            setPostCardLoading(false);
            throw new Error('Unknown error occurred');
          }
        } else if (data.count) {
          console.log("[✓] Total posts:", data.count);
          setTotalPosts(data.count);
          setPostCardLoading(false);
        }
      } catch (error) {
        alert('Error fetching total post count');
        setPostCardError(true);
        setPostCardLoading(false);
        console.error('[!] Failed to fetch total post count:', error);
      }
    })();

    console.log("[i] Calculating user count...");
    (async () => {
      try {
        const username = document.cookie.split('; ').find(row => row.startsWith('username='))?.split('=')[1] || '';
        const key = document.cookie.split('; ').find(row => row.startsWith('key='))?.split('=')[1] || '';
        
        const res = await fetch(`http://localhost:3001/api/admin/users/totalUsers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            key
          }),
          cache: 'no-store',
        });

        if (!res.ok) {
          alert('Failed to fetch total user count');
          setUserCtCardError(true);
          throw new Error(`Failed to fetch total user count: ${res.status}`);
        }

        const data = await res.json();
        if (data.success === false) {
          if (data.message) {
            alert(data.message);
            setUserCtCardError(true);
            setUserCtCardLoading(false);
            throw new Error(data.message);
          } else {
            alert('Unknown error occurred');
            setUserCtCardError(true);
            setUserCtCardLoading(false);
            throw new Error('Unknown error occurred');
          }
        } else if (data.count) {
          console.log("[✓] Total users:", data.count);
          setTotalUsers(data.count);
          setUserCtCardLoading(false);
        }
      } catch (error) {
        alert('Error fetching total user count');
        setUserCtCardError(true);
        setUserCtCardLoading(false);
        console.error('[!] Failed to fetch total user count:', error);
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">{strings.adminHeader}</h1>
      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl text-primary">{strings.totalUsersCardTitle}</CardTitle>
              <span className="text-4xl font-bold text-primary ml-2">
                {userCtCardLoading ? (
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-slate-800 border-white"></div>
                ) : userCtCardError ? (
                  <div className="flex items-center text-red-500">
                    <CircleAlert />
                    <p className="text-base ml-1.5">Error</p>
                  </div>
                ) : (
                  totalUsers
                )}
              </span>
            </div>
          </CardHeader>
        </Card>
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl text-primary">{strings.totalPostsCardTitle}</CardTitle>
              <span className="text-4xl font-bold text-primary ml-2">
                {postCardLoading ? (
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-slate-800 border-white"></div>
                ) : postCardError ? (
                  <div className="flex items-center text-red-500">
                    <CircleAlert />
                    <p className="text-base ml-1.5">Error</p>
                  </div>
                ) : (
                  totalPosts
                )}
              </span>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/admin/posts/new">
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

