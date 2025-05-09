"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Book, Insight } from "@/components/book-insight-tracker"
import { X } from "lucide-react"

interface InsightFormProps {
  books: Book[]
  selectedBookId?: string
  onSubmit: (insightId: string | null, insight: Omit<Insight, "id" | "dateAdded" | "lastReviewed" | "nextReviewDate">) => void
  onClose: () => void
  show: boolean
  editingInsight?: Insight
}

export function InsightForm({ books, selectedBookId, onSubmit, onClose, show, editingInsight }: InsightFormProps) {
  const [bookId, setBookId] = useState(editingInsight?.bookId || selectedBookId || (books.length > 0 ? books[0].id : ""))
  const [content, setContent] = useState(editingInsight?.content || "")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState(editingInsight?.tags || [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (bookId && content.trim()) {
      onSubmit(
        editingInsight?.id || null,
        {
          bookId,
          content: content.trim(),
          tags,
        }
      )
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Card className={show ? "" : "hidden"}>
      <CardHeader>
        <CardTitle>{editingInsight ? "Edit Insight" : "Add New Insight"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="book">Book</Label>
            <Select value={bookId} onValueChange={setBookId} required>
              <SelectTrigger id="book">
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.title} by {book.author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Insight</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your key takeaway or insight"
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tags (press Enter to add)"
              />
              <Button type="button" onClick={addTag} disabled={!tagInput.trim()}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!bookId || !content.trim()}>
            {editingInsight ? "Save Changes" : "Add Insight"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
