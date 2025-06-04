"use client"

import Login from "./login/page";

import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Login />

  return (
    <div>Hello World</div>
  );
}
