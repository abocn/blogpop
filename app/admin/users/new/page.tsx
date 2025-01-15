"use client"

import { useState } from "react"
import strings from "@/strings.json"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateUser() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3001/api/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
    console.log({ username, email, password })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">{strings.adminNewUserHeader}</h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{strings.newUserCardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{strings.newUserNameFieldLabel}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={strings.newUserNameFieldPlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{strings.newUserEmailFieldLabel}</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={strings.newUserEmailFieldPlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{strings.newUserPasswordFieldLabel}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={strings.newUserPasswordFieldPlaceholder}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">{strings.createUserButtonText}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

