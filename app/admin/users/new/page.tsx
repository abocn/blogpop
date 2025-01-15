"use client"

import { useState } from "react"
import strings from "@/strings.json"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateUser() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: handle form submission here!
    console.log({ name, email, password })
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
              <Label htmlFor="name">{strings.newUserNameFieldLabel}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

