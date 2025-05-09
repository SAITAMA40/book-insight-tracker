"use client"

import { AuthForm } from "@/components/auth-form";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <AuthForm />
      </div>
    </div>
  );
} 