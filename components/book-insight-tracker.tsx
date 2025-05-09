"use client"

import { useState, useEffect } from "react"
import { BookList } from "@/components/book-list"
import { BookForm } from "@/components/book-form"
import { InsightForm } from "@/components/insight-form"
import { BookDetailPage } from "@/components/book-detail-page"
import { Notifications } from "@/components/notifications"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { PlusCircle, BookOpen, BellRing } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export type Book = {
  id: string
  title: string
  author: string
  coverUrl: string
  dateAdded: Date
  tags?: string[]
}

export type Quote = {
  id: string
  bookId: string
  content: string
  pageNumber?: number
  dateAdded: Date
  tags?: string[]
}

export type PartialBook = Omit<Book, "id" | "dateAdded">

export type Insight = {
  id: string
  bookId: string
  content: string
  tags: string[]
  dateAdded: Date
  lastReviewed: Date | null
  nextReviewDate: Date | null
}

export type PartialInsight = Omit<Insight, "id" | "dateAdded" | "lastReviewed" | "nextReviewDate">

export type BookFormProps = {
  book?: Book
  onSubmit: (book: Book) => void
  onCancel: () => void
}

export type BookListProps = {
  books: Book[]
  insights: Insight[]
  onSelectBook: (book: Book) => void
  onEditBook: (book: Book) => void
  onDeleteBook: (book: Book) => void
  onTagClick: (tag: string) => void
  selectedTag?: string
}

export type InsightFormProps = {
  book: Book
  insight?: Insight
  onSubmit: (insightId: string | null, insight: Omit<Insight, "id" | "dateAdded" | "lastReviewed" | "nextReviewDate">) => void
  onCancel: () => void
}

export type BookDetailPageProps = {
  book: Book
  insights: Insight[]
  onClose: () => void
  onDeleteInsight: (insightId: string) => void
  onEditInsight: (insightId: string, insight: Omit<Insight, "id" | "dateAdded" | "lastReviewed" | "nextReviewDate">) => void
  onAddQuote: (quote: Omit<Quote, "id" | "dateAdded">) => void
  onEditQuote: (quoteId: string, quote: Omit<Quote, "id" | "dateAdded">) => void
  onDeleteQuote: (quoteId: string) => void
  allBooks: Book[]
}

export type NotificationsProps = {
  notifications: Insight[]
  books: Book[]
  onReviewInsight: (insightId: string) => void
}

export const BookInsightTracker = () => {
  // Initialize state
  const [showAddBookDialog, setShowAddBookDialog] = useState(false);
  const [showAddInsightDialog, setShowAddInsightDialog] = useState(false);
  const [showBookDetailPage, setShowBookDetailPage] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [editingInsight, setEditingInsight] = useState<Insight | undefined>(undefined);
  const [bookToDelete, setBookToDelete] = useState<Book | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("books");
  const [books, setBooks] = useState<Book[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [notifications, setNotifications] = useState<Insight[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  // Load data from localStorage or initialize with sample data
  useEffect(() => {
    const savedBooks = localStorage.getItem('book-insight-tracker-books')
    const savedInsights = localStorage.getItem('book-insight-tracker-insights')
    const savedQuotes = localStorage.getItem('book-insight-tracker-quotes')

    if (savedBooks && savedInsights && savedQuotes) {
      const parsedBooks = JSON.parse(savedBooks).map((book: any) => ({
        ...book,
        dateAdded: typeof book.dateAdded === 'string' ? new Date(book.dateAdded) : book.dateAdded
      }))
      
      const parsedInsights = JSON.parse(savedInsights).map((insight: any) => ({
        ...insight,
        dateAdded: typeof insight.dateAdded === 'string' ? new Date(insight.dateAdded) : insight.dateAdded,
        lastReviewed: insight.lastReviewed ? (typeof insight.lastReviewed === 'string' ? new Date(insight.lastReviewed) : insight.lastReviewed) : null,
        nextReviewDate: insight.nextReviewDate ? (typeof insight.nextReviewDate === 'string' ? new Date(insight.nextReviewDate) : insight.nextReviewDate) : null
      }))
      
      const parsedQuotes = JSON.parse(savedQuotes).map((quote: any) => ({
        ...quote,
        dateAdded: typeof quote.dateAdded === 'string' ? new Date(quote.dateAdded) : quote.dateAdded
      }))
      
      setBooks(parsedBooks)
      setInsights(parsedInsights)
      setQuotes(parsedQuotes)
      setNotifications(parsedInsights.filter((i: Insight) => !i.lastReviewed))
    } else {
      const sampleBooks: Book[] = [
        {
          id: crypto.randomUUID(),
          title: "Clean Code",
          author: "Robert C. Martin",
          dateAdded: new Date(),
          tags: ["programming", "best practices", "software engineering"],
          coverUrl: "/placeholder.svg?height=150&width=100"
        },
        {
          id: crypto.randomUUID(),
          title: "Design Patterns",
          author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
          dateAdded: new Date(),
          tags: ["software design", "patterns", "architecture"],
          coverUrl: "/placeholder.svg?height=150&width=100"
        }
      ]

      const sampleInsights: Insight[] = [
        {
          id: crypto.randomUUID(),
          bookId: sampleBooks[0].id,
          content: "Functions should be small and focused on doing one thing.",
          tags: ["programming", "best practices"],
          dateAdded: new Date(),
          lastReviewed: null,
          nextReviewDate: new Date()
        },
        {
          id: crypto.randomUUID(),
          bookId: sampleBooks[1].id,
          content: "The Factory Method pattern provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.",
          tags: ["patterns", "design"],
          dateAdded: new Date(),
          lastReviewed: null,
          nextReviewDate: new Date()
        }
      ]

      const sampleQuotes: Quote[] = [
        {
          id: crypto.randomUUID(),
          bookId: sampleBooks[0].id,
          content: "Clean code is not written by following a set of rules. You don't need to know design patterns or the latest programming techniques to write clean code.",
          dateAdded: new Date()
        },
        {
          id: crypto.randomUUID(),
          bookId: sampleBooks[1].id,
          content: "The Factory Method pattern provides a way to create objects without specifying the exact class of object that will be created.",
          dateAdded: new Date()
        }
      ]

      setBooks(sampleBooks)
      setInsights(sampleInsights)
      setQuotes(sampleQuotes)
      setNotifications(sampleInsights)
    }
  }, [])

  // Save data to localStorage whenever books or insights change
  useEffect(() => {
    localStorage.setItem('book-insight-tracker-books', JSON.stringify(
      books.map(book => ({
        ...book,
        dateAdded: typeof book.dateAdded === 'string' ? book.dateAdded : new Date(book.dateAdded).toISOString()
      }))
    ))
  }, [books])

  useEffect(() => {
    localStorage.setItem('book-insight-tracker-insights', JSON.stringify(
      insights.map(insight => ({
        ...insight,
        dateAdded: typeof insight.dateAdded === 'string' ? insight.dateAdded : new Date(insight.dateAdded).toISOString(),
        lastReviewed: insight.lastReviewed ? (typeof insight.lastReviewed === 'string' ? insight.lastReviewed : new Date(insight.lastReviewed).toISOString()) : null,
        nextReviewDate: insight.nextReviewDate ? (typeof insight.nextReviewDate === 'string' ? insight.nextReviewDate : new Date(insight.nextReviewDate).toISOString()) : null
      }))
    ))
    localStorage.setItem('book-insight-tracker-notifications', JSON.stringify(notifications))
  }, [insights, notifications])

  useEffect(() => {
    localStorage.setItem('book-insight-tracker-quotes', JSON.stringify(
      quotes.map(quote => ({
        ...quote,
        dateAdded: typeof quote.dateAdded === 'string' ? quote.dateAdded : new Date(quote.dateAdded).toISOString()
      }))
    ))
  }, [quotes])

  // Spaced repetition algorithm for review intervals
  const getDaysUntilNextReview = (insight: Insight): number => {
    const daysSinceLastReview = Math.floor(
      (new Date().getTime() - (insight.lastReviewed?.getTime() || 0)) / (1000 * 60 * 60 * 24)
    )

    // Simple spaced repetition algorithm
    if (!insight.lastReviewed) return 1 // First review after 1 day
    if (daysSinceLastReview < 1) return 1 // Review again tomorrow if not reviewed today
    
    // Increase interval based on number of reviews
    const reviewCount = Math.floor(daysSinceLastReview / 7) // Roughly weekly reviews
    return Math.min(30, 7 * (reviewCount + 1)) // Cap at 30 days
  }

  // Book management functions
  const selectBook = (book: Book) => {
    setSelectedTag(undefined)
    setSelectedBook(book)
    setShowBookDetailPage(true)
  }

  const editBook = (book: Book) => {
    setEditingBook(book)
    setShowAddBookDialog(true)
  }

  const deleteBook = (book: Book) => {
    setBookToDelete(book)
    setShowDeleteConfirmation(true)
  }

  const confirmDeleteBook = () => {
    if (!bookToDelete) return;

    const updatedBooks = books.filter((b) => b.id !== bookToDelete.id);
    const updatedInsights = insights.filter((i) => i.bookId !== bookToDelete.id);
    const updatedQuotes = quotes.filter((q) => q.bookId !== bookToDelete.id);

    setBooks(updatedBooks)
    setInsights(updatedInsights)
    setQuotes(updatedQuotes)
    setNotifications(updatedInsights.filter((n) => !n.lastReviewed))
    setBookToDelete(undefined)
    setShowDeleteConfirmation(false)
  }

  const handleBookSubmit = (bookId: string | null, book: PartialBook) => {
    if (bookId) {
      const updatedBooks = books.map((b) =>
        b.id === bookId ? {
          ...b,
          title: book.title || b.title,
          author: book.author || b.author,
          coverUrl: book.coverUrl || b.coverUrl,
          tags: book.tags || b.tags
        } : b
      )
      setBooks(updatedBooks)
    } else {
      const newBook: Book = {
        ...book,
        id: bookId || crypto.randomUUID(),
        dateAdded: new Date(),
      }
      setBooks(prev => [...prev, newBook])
    }
    setShowAddBookDialog(false)
    setEditingBook(undefined)
  }

  // Insight management functions
  const handleInsightSubmit = (insightId: string | null, insight: Omit<Insight, "id" | "dateAdded" | "lastReviewed" | "nextReviewDate">) => {
    if (insightId) {
      setInsights(insights.map(i => i.id === insightId ? { ...i, ...insight } : i))
    } else {
      const newInsight: Insight = {
        ...insight,
        id: crypto.randomUUID(),
        dateAdded: new Date(),
        lastReviewed: null,
        nextReviewDate: new Date()
      }

      // Check for duplicate insight
      const existingInsight = insights.find((i) => 
        i.bookId === newInsight.bookId && 
        i.content === newInsight.content && 
        i.tags?.join(',') === newInsight.tags?.join(',')
      )

      if (existingInsight) {
        alert('Duplicate insight detected. Please review your existing insights.')
        return
      }

      setInsights([...insights, newInsight])
      setNotifications([...notifications, newInsight])
    }
    setShowAddInsightDialog(false)
    setEditingInsight(undefined)
  }

  const handleInsightDelete = (insightId: string) => {
    const updatedInsights = insights.filter((i) => i.id !== insightId)
    setInsights(updatedInsights)
    setNotifications(notifications.filter((n) => n.id !== insightId))
  }

  const onReviewInsight = (insightId: string) => {
    const insightIndex = insights.findIndex((i) => i.id === insightId)
    if (insightIndex === -1) return

    const updatedInsights = [...insights]
    const updatedInsight = {
      ...updatedInsights[insightIndex],
      lastReviewed: new Date(),
      nextReviewDate: new Date(Date.now() + getDaysUntilNextReview(updatedInsights[insightIndex]) * 24 * 60 * 60 * 1000)
    }
    updatedInsights[insightIndex] = updatedInsight

    setInsights(updatedInsights)
    setNotifications(updatedInsights.filter((n) => !n.lastReviewed))
  }

  const handleInsightEdit = (
    insightId: string,
    insight: Omit<Insight, "id" | "dateAdded" | "lastReviewed" | "nextReviewDate">
  ) => {
    const updatedInsights = insights.map((i) =>
      i.id === insightId ? { ...i, ...insight } : i
    )

    setInsights(updatedInsights)
    setNotifications(updatedInsights.filter((n) => !n.lastReviewed))
    setShowAddInsightDialog(true)
    setEditingInsight(insight as Insight)
  }

  const handleQuoteAdd = (quote: Omit<Quote, "id" | "dateAdded">) => {
    setQuotes([...quotes, {
      ...quote,
      id: crypto.randomUUID(),
      dateAdded: new Date()
    }])
  }

  const handleQuoteEdit = (quoteId: string, quote: Omit<Quote, "id" | "dateAdded">) => {
    setQuotes(quotes.map(q => q.id === quoteId ? { ...q, ...quote } : q))
  }

  const handleQuoteDelete = (quoteId: string) => {
    setQuotes(quotes.filter(q => q.id !== quoteId))
  }

  const cancelDeleteBook = () => {
    setShowDeleteConfirmation(false)
    setBookToDelete(undefined)
  }

  // Save data to localStorage whenever books or insights change
  useEffect(() => {
    localStorage.setItem('book-insight-tracker-books', JSON.stringify(
      books.map(book => ({
        ...book,
        dateAdded: typeof book.dateAdded === 'string' ? book.dateAdded : new Date().toISOString()
      }))
    ))
  }, [books])

  useEffect(() => {
    localStorage.setItem('book-insight-tracker-insights', JSON.stringify(
      insights.map(insight => ({
        ...insight,
        dateAdded: typeof insight.dateAdded === 'string' ? insight.dateAdded : new Date().toISOString(),
        lastReviewed: insight.lastReviewed ? (typeof insight.lastReviewed === 'string' ? insight.lastReviewed : new Date().toISOString()) : null,
        nextReviewDate: insight.nextReviewDate ? (typeof insight.nextReviewDate === 'string' ? insight.nextReviewDate : new Date().toISOString()) : null
      }))
    ))
    localStorage.setItem('book-insight-tracker-notifications', JSON.stringify(notifications))
  }, [insights, notifications])

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Book Insight Tracker</h1>
          <div className="flex gap-4">
            <Button onClick={() => setShowAddBookDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Book
            </Button>
            <Button onClick={() => {
              setShowAddInsightDialog(true);
              setEditingInsight(undefined);
            }}>
              <BookOpen className="mr-2 h-4 w-4" />
              Add Insight
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Tabs defaultValue="books">
            <TabsList>
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            <TabsContent value="books" className="space-y-4">
              <BookList
                books={books}
                insights={insights}
                onSelectBook={selectBook}
                onEditBook={editBook}
                onDeleteBook={deleteBook}
                onTagClick={setSelectedTag}
                selectedTag={selectedTag}
              />
            </TabsContent>
            <TabsContent value="insights" className="space-y-4">
              <Notifications
                notifications={notifications}
                books={books}
                onReviewInsight={onReviewInsight}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={showAddBookDialog} onOpenChange={setShowAddBookDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{editingBook ? "Edit Book" : "Add New Book"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <BookForm
              onSubmit={handleBookSubmit}
              onClose={() => {
                setShowAddBookDialog(false)
                setEditingBook(undefined)
              }}
              show={showAddBookDialog}
              editingBook={editingBook}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddInsightDialog} onOpenChange={setShowAddInsightDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{editingInsight ? "Edit Insight" : "Add New Insight"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <InsightForm
              books={books}
              selectedBookId={selectedBook?.id}
              onSubmit={handleInsightSubmit}
              onClose={() => {
                setShowAddInsightDialog(false)
                setEditingInsight(undefined)
              }}
              show={showAddInsightDialog}
              editingInsight={editingInsight}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBookDetailPage} onOpenChange={setShowBookDetailPage}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedBook?.title || 'Book Details'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <BookDetailPage
              book={selectedBook!}
              insights={insights.filter(i => i.bookId === selectedBook?.id)}
              quotes={quotes.filter(q => q.bookId === selectedBook?.id)}
              onClose={() => {
                setShowBookDetailPage(false)
                setSelectedBook(undefined)
              }}
              onDeleteInsight={handleInsightDelete}
              onEditInsight={handleInsightEdit}
              onAddInsight={(insight) => handleInsightSubmit(null, insight)}
              onAddQuote={handleQuoteAdd}
              onEditQuote={handleQuoteEdit}
              onDeleteQuote={handleQuoteDelete}
              allBooks={books}
              onEditBook={editBook}
              onDeleteBook={deleteBook}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-red-500">
              Are you sure you want to delete this book and all its insights?
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelDeleteBook}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteBook}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}