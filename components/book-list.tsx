"use client"

import type { Book, Insight } from "@/components/book-insight-tracker"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Tag, Edit2, Trash2 } from "lucide-react"
import Image from "next/image"

interface BookListProps {
  books: Book[]
  insights: Insight[]
  onSelectBook: (book: Book) => void
  onEditBook: (book: Book) => void
  onDeleteBook: (book: Book) => void
  onTagClick?: (tag: string) => void
  selectedTag?: string
}

export function BookList({ books, insights, onSelectBook, onEditBook, onDeleteBook }: BookListProps) {
  // Get unique tags across all insights
  const allTags = Array.from(new Set(insights.flatMap((insight) => insight.tags)))

  // Get tags that are actually used by books in the list
  const usedTags = Array.from(new Set(
    books
      .flatMap(book => insights.filter(insight => insight.bookId === book.id))
      .flatMap(insight => insight.tags)
  ))

  return (
    <div>
      {books.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-medium">No books yet</h3>
          <p className="mt-2 text-sm text-slate-500">Add your first book to start tracking insights</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const bookInsights = insights.filter((i) => i.bookId === book.id)
            const bookTags = Array.from(new Set(bookInsights.flatMap((insight) => insight.tags)))

            return (
              <Card
                key={book.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectBook(book)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <Image
                      src={book.coverUrl || "/placeholder.svg"}
                      alt={book.title}
                      width={60}
                      height={90}
                      className="object-cover rounded-sm"
                    />
                    <div>
                      <div className="flex items-center justify-between w-full mb-2">
                        <CardTitle className="text-xl">{book.title}</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              onEditBook(book)
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteBook(book)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>{book.author}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditBook(book);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBook(book);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <BookOpen className="h-4 w-4" />
                    <span>{bookInsights.length} insights</span>
                  </div>

                  {bookTags.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Tags:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {bookTags.slice(0, 3).map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                        {bookTags.length > 3 && <Badge>+{bookTags.length - 3} more</Badge>}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="text-xs text-slate-500">
                  Added on {new Date(book.dateAdded).toLocaleDateString()}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
