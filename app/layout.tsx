import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Book Insight Tracker",
  description: "Track your book insights and quotes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <h1 className="text-2xl font-bold">Book Insight Tracker</h1>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
