"use client"

import type { Book, Insight } from "@/components/book-insight-tracker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Calendar, Check, Tag } from "lucide-react"
import Image from "next/image"

interface BookDetailsProps {
  book: Book
  insights: Insight[]
  onBack: () => void
  onReviewInsight: (insightId: string) => void
}

export function BookDetails({ book, insights, onBack, onReviewInsight }: BookDetailsProps) {
  const today = new Date()

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Books
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 lg:w-1/4">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <Image
                  src={book.coverUrl || "/placeholder.svg"}
                  alt={book.title}
                  width={150}
                  height={225}
                  className="object-cover rounded-md mb-4"
                />
                <CardTitle className="text-center">{book.title}</CardTitle>
                <CardDescription className="text-center">{book.author}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <BookOpen className="h-4 w-4" />
                <span>{insights.length} insights</span>
              </div>
              <div className="text-center text-sm text-slate-500 mt-4">
                Added on {book.dateAdded.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3 lg:w-3/4">
          <h2 className="text-2xl font-bold mb-4">Insights</h2>

          {insights.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-medium">No insights yet</h3>
              <p className="mt-2 text-sm text-slate-500">Add your first insight for this book</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => {
                const isReviewDue = insight.nextReviewDate && insight.nextReviewDate <= today

                return (
                  <Card key={insight.id} className={isReviewDue ? "border-amber-300 dark:border-amber-700" : ""}>
                    <CardContent className="pt-6">
                      <p className="text-lg mb-4">{insight.content}</p>

                      {insight.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <Tag className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          {insight.tags.map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap justify-between items-center mt-4 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Added: {insight.dateAdded.toLocaleDateString()}</span>
                        </div>

                        {isReviewDue ? (
                          <Button
                            size="sm"
                            onClick={() => onReviewInsight(insight.id)}
                            className="flex items-center gap-2"
                          >
                            <Check className="h-4 w-4" />
                            Mark as Reviewed
                          </Button>
                        ) : (
                          <div>
                            {insight.lastReviewed ? (
                              <span>Last reviewed: {insight.lastReviewed.toLocaleDateString()}</span>
                            ) : (
                              <span>Not yet reviewed</span>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
