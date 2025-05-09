"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { Book } from "@/components/book-insight-tracker"

interface BookFormProps {
  onSubmit: (bookId: string | null, book: Omit<Book, "id" | "dateAdded">) => void
  onClose: () => void
  show: boolean
  editingBook?: Book
}

export function BookForm({ onSubmit, onClose, show, editingBook }: BookFormProps) {
  const [title, setTitle] = useState(editingBook?.title || "")
  const [author, setAuthor] = useState(editingBook?.author || "")
  const [coverUrl, setCoverUrl] = useState(editingBook?.coverUrl || "/placeholder.svg?height=150&width=100")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && author.trim()) {
      onSubmit(
        editingBook?.id || null,
        {
          title: title.trim(),
          author: author.trim(),
          coverUrl,
        }
      )
    }
  }

  return (
    <Card className={show ? "" : "hidden"}>
      <CardHeader>
        <CardTitle>{editingBook ? "Edit Book" : "Add New Book"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Book Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverUrl">Cover Image URL (optional)</Label>
            <Input
              id="coverUrl"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="Enter cover image URL"
            />
            <p className="text-xs text-slate-500">Leave default for a placeholder image</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!title.trim() || !author.trim()}>
            {editingBook ? "Save Changes" : "Add Book"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
