"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import strings from "@/strings.json"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false
})

import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"

const categories = ["Example Category 1", "Example Category 2"]

export default function CreatePost() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")

  const handleEditorChange = (value: string | undefined) => {
    setContent(value || "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    const date = Math.floor(Date.now() / 1000);
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3001/api/posts/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, category, slug, content, date }),
      });

      if (!response.ok) {
      throw new Error('Failed to create post');
      }

      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
    console.log({ title, description, category, slug, content, date })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary">{strings.adminNewPostHeader}</h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{strings.newPostCardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{strings.newPostTitleFieldLabel}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={strings.newPostTitleFieldPlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{strings.newPostDescriptionFieldLabel}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={strings.newPostDescriptionFieldPlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">{strings.newPostCategoryFieldLabel}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={strings.newPostCategoryFieldPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">{strings.newPostSlugFieldLabel}</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={strings.newPostSlugFieldPlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label>{strings.newPostContentFieldLabel}</Label>
              <MDEditor
                value={content}
                onChange={handleEditorChange}
                height={400}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">{strings.createPostButtonText}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

