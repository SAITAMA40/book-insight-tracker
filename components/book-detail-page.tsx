"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, Edit2, Trash2, Plus, ArrowUp } from "lucide-react"
import { Book, Insight, Quote } from "@/components/book-insight-tracker"
import { InsightForm } from "@/components/insight-form"
import { QuoteForm } from "@/components/quote-form"

interface BookDetailPageProps {
  book: Book
  insights: Insight[]
  quotes: Quote[]
  onClose: () => void
  onDeleteInsight: (insightId: string) => void
  onEditInsight: (insightId: string, insight: Omit<Insight, "id" | "dateAdded" | "lastReviewed" | "nextReviewDate">) => void
  onAddInsight: (insight: Omit<Insight, "id" | "dateAdded" | "lastReviewed" | "nextReviewDate">) => void
  onAddQuote: (quote: Omit<Quote, "id" | "dateAdded">) => void
  onEditQuote: (quoteId: string, quote: Omit<Quote, "id" | "dateAdded">) => void
  onDeleteQuote: (quoteId: string) => void
  allBooks: Book[]
  onEditBook: (book: Book) => void
  onDeleteBook: (book: Book) => void
}

export function BookDetailPage({
  book,
  insights,
  quotes,
  onClose,
  onDeleteInsight,
  onEditInsight,
  onAddInsight,
  onAddQuote,
  onEditQuote,
  onDeleteQuote,
  allBooks,
  onEditBook,
  onDeleteBook
}: BookDetailPageProps) {
  const [showInsightForm, setShowInsightForm] = useState(false)
  const [editingInsight, setEditingInsight] = useState<Insight | undefined>(undefined)
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [editingQuote, setEditingQuote] = useState<Quote | undefined>(undefined)
  const [showMoreInsights, setShowMoreInsights] = useState(false)
  const [showMoreQuotes, setShowMoreQuotes] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const MAX_VISIBLE_ITEMS = 5

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollPosition = contentRef.current.scrollTop
        setShowScrollButton(scrollPosition > 200)
      }
    }

    if (contentRef.current) {
      contentRef.current.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (contentRef.current) {
        contentRef.current.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const handleQuoteSubmit = (quote: Omit<Quote, "id" | "dateAdded">) => {
    if (editingQuote) {
      onEditQuote(editingQuote.id, quote)
    } else {
      onAddQuote(quote)
    }
    setShowQuoteForm(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {book && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
            <p className="text-gray-600">by {book.author}</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      )}

      {showScrollButton && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 right-4 bg-white shadow-lg rounded-full hover:bg-gray-50"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}

      <div
        ref={contentRef}
        className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]"
      >
        {book && (
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold">{book.title}</h2>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onEditBook(book)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Book
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDeleteBook(book)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Book
              </Button>
            </div>
          </div>
        </div>
        )}

        <div className="p-8 bg-white rounded-lg shadow-lg w-full flex flex-col relative overflow-hidden">
          <div className="flex-1 flex flex-row gap-8 w-full">
            <div className="flex-1 flex flex-col items-center space-y-6">
              {book && book.coverUrl && (
                <div className="w-128 h-64 bg-gray-100 rounded-lg overflow-hidden shadow-lg aspect-[2/3]">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {book && (
                <div>
                  <p className="text-lg font-medium text-gray-700">{book.author}</p>
                  <p className="text-sm text-gray-500 mt-1">Added on {book.dateAdded ? new Date(book.dateAdded).toLocaleDateString() : 'N/A'}</p>
                  {book.tags && book.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {book.tags.map((tag: string) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-6 h-full overflow-y-auto">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Insights</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInsightForm(true)
                    setEditingInsight(undefined)
                  }}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Insight
                </Button>
              </div>
              <div className="flex flex-col gap-6">
                {insights.length === 0 ? (
                  <p className="text-gray-500">No insights yet. Add your first insight!</p>
                ) : (
                  <div className="space-y-8">
                    {insights
                      .slice(0, showMoreInsights ? insights.length : MAX_VISIBLE_ITEMS)
                      .map((insight: Insight) => (
                        <div key={insight.id} className="p-6 bg-gray-50 rounded-lg shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-xs text-gray-500">
                                Added on {insight.dateAdded ? new Date(insight.dateAdded).toLocaleDateString() : 'N/A'}
                              </p>
                              {insight.lastReviewed && (
                                <p className="text-xs text-green-500">
                                  Last reviewed: {insight.lastReviewed ? new Date(insight.lastReviewed).toLocaleDateString() : 'N/A'}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingInsight(insight)
                                  setShowInsightForm(true)
                                }}
                              >
                                <Edit2 className="mr-1 h-3 w-3" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDeleteInsight(insight.id)}
                              >
                                <Trash2 className="mr-1 h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-gray-700">"{insight.content}"</p>
                            {insight.tags && insight.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {insight.tags.map((tag: string) => (
                                  <Badge key={tag}>{tag}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    {insights.length > MAX_VISIBLE_ITEMS && !showMoreInsights && (
                      <Button
                        variant="outline"
                        onClick={() => setShowMoreInsights(true)}
                        className="w-full justify-center"
                      >
                        Show More Insights
                      </Button>
                    )}
                    {insights.length > MAX_VISIBLE_ITEMS && showMoreInsights && (
                      <Button
                        variant="outline"
                        onClick={() => setShowMoreInsights(false)}
                        className="w-full justify-center"
                      >
                        Show Less
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Quotes</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowQuoteForm(true)
                    setEditingQuote(undefined)
                  }}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Quote
                </Button>
              </div>
              {showQuoteForm && (
                <QuoteForm
                  book={book}
                  quote={editingQuote}
                  onClose={() => {
                    setShowQuoteForm(false)
                    setEditingQuote(undefined)
                  }}
                  onSubmit={handleQuoteSubmit}
                />
              )}
              <div className="space-y-4">
                {quotes.length === 0 ? (
                  <p className="text-gray-500">No quotes yet. Add your first quote!</p>
                ) : (
                  <div className="space-y-4">
                    {quotes
                      .slice(0, showMoreQuotes ? quotes.length : MAX_VISIBLE_ITEMS)
                      .map((quote: Quote) => (
                        <div key={quote.id} className="p-4 border rounded-md">
                          <div className="space-y-2">
                            <p className="font-medium">{quote.content}</p>
                            {quote.pageNumber && (
                              <p className="text-sm text-gray-500">
                                Page {quote.pageNumber}
                              </p>
                            )}
                            {quote.tags && quote.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {quote.tags.map((tag: string) => (
                                  <Badge key={tag}>{tag}</Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex justify-end gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingQuote(quote)
                                  setShowQuoteForm(true)
                                }}
                              >
                                <Edit2 className="mr-1 h-3 w-3" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDeleteQuote(quote.id)}
                              >
                                <Trash2 className="mr-1 h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    {quotes.length > MAX_VISIBLE_ITEMS && !showMoreQuotes && (
                      <Button
                        variant="outline"
                        onClick={() => setShowMoreQuotes(true)}
                        className="w-full justify-center"
                      >
                        Show More Quotes
                      </Button>
                    )}
                    {quotes.length > MAX_VISIBLE_ITEMS && showMoreQuotes && (
                      <Button
                        variant="outline"
                        onClick={() => setShowMoreQuotes(false)}
                        className="w-full justify-center"
                      >
                        Show Less
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showInsightForm && (
        <Dialog open={showInsightForm} onOpenChange={setShowInsightForm}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{editingInsight ? 'Edit Insight' : 'Add New Insight'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <InsightForm
                books={allBooks}
                selectedBookId={book.id}
                onSubmit={(insightId, insight) => {
                  if (insightId) {
                    onEditInsight(insightId, insight)
                  } else {
                    onAddInsight(insight)
                  }
                  setShowInsightForm(false)
                }}
                onClose={() => {
                  setShowInsightForm(false)
                  setEditingInsight(undefined)
                }}
                show={showInsightForm}
                editingInsight={editingInsight}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
