"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your authentication logic here
    console.log("Submitting form:", { email, password, isLogin })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {isLogin ? "Login" : "Register"}
          </Button>
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need an account? Register" : "Already have an account? Login"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
