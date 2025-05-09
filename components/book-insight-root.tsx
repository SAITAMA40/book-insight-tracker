"use client"

import { BookInsightTracker } from "./book-insight-tracker"

export default function BookInsightRoot() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <BookInsightTracker />
    </main>
  )
}
