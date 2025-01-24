'use client';

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const validate = async () => {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);

      if (cookies.key) {
        console.log('[i] Key found in browser cookies, checking validity');
        try {
          const response = await fetch('http://localhost:3001/api/admin/validate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: cookies.key, username: cookies.username }),
          })

          if (!response.ok) {
            console.log('[!] Failed to check key, skipping validation and clearing cookie');
            document.cookie = 'key=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          } else {
            const data = await response.json()
            if (data.valid) {
              // key exists and is valid, user has no reason to use login
              console.log("[✓] Key is valid, redirecting to admin panel");
              window.location.href = '/admin';
            } else {
              // key exists, but the server reports its not the latest key
              console.log("[!] Key is invalid, clearing cookie and redirecting to login");
              document.cookie.split(";").forEach((cookie) => {
                document.cookie = cookie
                  .replace(/^ +/, "")
                  .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/");
              });
              window.location.reload();
            }
          }
        } catch (error) {
          console.error('[!]', error)
          setError('Failed to connect to the server. Please try again later.')
        }
      }
    };

    if (typeof window !== 'undefined') {
      validate();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        console.log('[!] Failed to login');
        setError('An unknown error occurred. Please try again later.')
      } else {
        const data = await response.json()
        if (data.success && data.key) {
          console.log("[✓] Login successful, redirecting to admin panel");
          document.cookie = `key=${data.key}; path=/; secure; samesite=strict`;
          document.cookie = `username=${username}; path=/; secure; samesite=strict`;
          document.location.href = '/admin';
        } else {
          if (!data.success && data.message) {
            setError(data.message)
          } else {
            setError('An unknown error occurred. Please try again later.')
          }
        }
      }
    } catch (error) {
      console.error('[i]', error)
      setError('Failed to connect to the server. Please try again later.')
    }
  }

  return (
    <div className={cn("relative flex min-h-screen flex-col", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Administration Panel</CardTitle>
          <CardDescription>
            Please authenticate with your credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 mb-6">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
