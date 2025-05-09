"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { Book } from "@/components/book-insight-tracker"

export type Quote = {
  id: string
  bookId: string
  content: string
  pageNumber?: number
  dateAdded: Date
  tags?: string[]
}

export type QuoteFormProps = {
  book: Book
  quote?: Quote
  onSubmit: (quote: Omit<Quote, "id" | "dateAdded">) => void
  onClose: () => void
}

export function QuoteForm({ book, quote, onSubmit, onClose }: QuoteFormProps) {
  const [content, setContent] = useState(quote?.content || "")
  const [pageNumber, setPageNumber] = useState<string>(quote?.pageNumber?.toString() || "")
  const [tags, setTags] = useState<string[]>(quote?.tags || [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedPageNumber = pageNumber ? parseInt(pageNumber) : undefined
    onSubmit({
      bookId: book.id,
      content,
      pageNumber: parsedPageNumber,
      tags: tags.length > 0 ? tags : undefined
    })
    onClose()
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      const newTag = e.currentTarget.value.trim()
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
        e.currentTarget.value = ""
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Quote</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the quote from the book..."
          required
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pageNumber">Page Number (optional)</Label>
        <Input
          id="pageNumber"
          type="number"
          value={pageNumber}
          onChange={(e) => setPageNumber(e.target.value)}
          placeholder="Enter page number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (optional)</Label>
        <div className="flex flex-col gap-2">
          <Input
            onKeyDown={handleAddTag}
            placeholder="Press Enter to add a tag"
          />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter(t => t !== tag))}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" onClick={onClose} className="absolute top-4 right-4">
          <X className="h-4 w-4" />
        </Button>
        <Button type="submit">
          {quote ? "Update Quote" : "Add Quote"}
        </Button>
      </div>
    </form>
  )
}
