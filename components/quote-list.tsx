"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit2, Plus } from "lucide-react"
import { QuoteForm } from "./quote-form"
import { Book, Quote } from "@/components/book-insight-tracker"

export type QuoteListProps = {
  book: Book
  quotes: Quote[]
  onAddQuote: (quote: Omit<Quote, "id" | "dateAdded">) => void
  onEditQuote: (quoteId: string, quote: Omit<Quote, "id" | "dateAdded">) => void
  onDeleteQuote: (quoteId: string) => void
}

export function QuoteList({ book, quotes, onAddQuote, onEditQuote, onDeleteQuote }: QuoteListProps) {
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [editingQuote, setEditingQuote] = useState<Quote | undefined>(undefined)

  const handleAddQuote = (quote: Omit<Quote, "id" | "dateAdded">) => {
    onAddQuote(quote)
    setShowQuoteForm(false)
  }

  const handleEditQuote = (quoteId: string, quote: Omit<Quote, "id" | "dateAdded">) => {
    onEditQuote(quoteId, quote)
    setShowQuoteForm(false)
    setEditingQuote(undefined)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Quotes</h3>
        <Button
          variant="outline"
          onClick={() => {
            setShowQuoteForm(true)
            setEditingQuote(undefined)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Quote
        </Button>
      </div>

      {showQuoteForm && (
        <QuoteForm
          book={book}
          quote={editingQuote}
          onClose={() => setShowQuoteForm(false)}
          onSubmit={(quote) => {
            if (editingQuote) {
              onEditQuote(editingQuote.id, quote)
            } else {
              onAddQuote(quote)
            }
          }}
        />
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Quotes</h3>
          <Button
            variant="outline"
            onClick={() => setShowQuoteForm(true)}
            className="h-8"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Quote
          </Button>
        </div>

        {showQuoteForm && (
          <div className="h-[500px] overflow-y-auto p-4">
            <QuoteForm
              book={book}
              quote={editingQuote || undefined}
              onClose={() => setShowQuoteForm(false)}
              onSubmit={(quote) => {
                if (editingQuote) {
                  onEditQuote(editingQuote.id, quote)
                } else {
                  onAddQuote(quote)
                }
              }}
            />
          </div>
        )}

        {quotes.length === 0 ? (
          <p className="text-muted-foreground">No quotes added yet</p>
        ) : (
          <div className="h-[600px] overflow-y-auto space-y-4 p-2">
            {quotes.map((quote) => (
              <div key={quote.id} className="p-4 border rounded-md">
                <div className="space-y-2">
                  <p className="font-medium">{quote.content}</p>
                  {quote.pageNumber && (
                    <p className="text-sm text-muted-foreground">
                      Page {quote.pageNumber}
                    </p>
                  )}
                  {quote.tags && quote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {quote.tags.map((tag) => (
                        <Badge key={tag}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingQuote(quote)
                        setShowQuoteForm(true)
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteQuote(quote.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
