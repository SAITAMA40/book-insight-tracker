"use client"

import type { Book, Insight } from "@/components/book-insight-tracker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, BookOpen, Check } from "lucide-react"

interface NotificationsProps {
  notifications: Insight[]
  books: Book[]
  onReviewInsight: (insightId: string) => void
}

export function Notifications({ notifications, books, onReviewInsight }: NotificationsProps) {
  // Filter notifications to only show valid insights
  const validNotifications = notifications.filter(insight => {
    const book = books.find(b => b.id === insight.bookId)
    return book !== undefined
  })

  const getBookById = (bookId: string) => {
    return books.find((book) => book.id === bookId)
  }

  return (
    <div>
      {validNotifications.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <Bell className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-medium">No insights to review</h3>
          <p className="mt-2 text-sm text-slate-500">You're all caught up! Check back later for insights to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Insights to Review</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Review these insights to reinforce your learning through spaced repetition.
          </p>

          <div className="space-y-4 mt-6">
            {validNotifications.map((insight) => {
              const book = getBookById(insight.bookId)

              return (
                <Card key={insight.id} className="border-amber-300 dark:border-amber-700">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Time to review this insight</CardTitle>
                        <CardDescription>
                          From <span className="font-medium">{book ? book.title : "Unknown book"}</span>
                        </CardDescription>
                      </div>
                      <Button size="sm" onClick={() => onReviewInsight(insight.id)} className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Mark as Reviewed
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg mb-4">{insight.content}</p>

                    {insight.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {insight.tags.map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-4">
                      <BookOpen className="h-4 w-4" />
                      <span>
                        {book ? (
                          <>
                            From: {book.title} by {book.author}
                          </>
                        ) : (
                          "Unknown book"
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
