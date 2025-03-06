"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie";
import { toast } from "sonner"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] =useState("");
  const router =useRouter()

  async function handlelogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })
      toast("Login Succesfully!")

      Cookies.set("sb-access-token", data.session?.access_token || "", { secure: true });
      router.push("/dashboard"); 
      
    } catch (error) {
      toast("Please check you creds...")
    } finally {
      setIsLoading(false)
    }
  }
  const handleGoogleSignIn = async () => {
    try {
      const {data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log("data", data);

    } catch (error) {
      console.error("Google sign-in error:", error.message);
      toast("Please check you creds...")
    }
    // const {data, error } = await supabase.auth.signInWithOAuth({
    //   provider: "google",
    //   options: {
    //     redirectTo: `${window.location.origin}/auth/callback`,
    //   },
    // });

    // if (error) console.error("Google sign-in error:", error.message);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("session", session);

      if (session) {
        router.push("/dashboard"); // Redirect if already logged in
      } else {
        // setLoading(false);
      }
    };

    checkSession();
  }, [router]);



  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-[400px] space-y-6 p-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
        </div>

          <form onSubmit={handlelogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary/50"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Checking..." : "Submit"}
            </Button>
          </form>

          <button onClick={handleGoogleSignIn} className="p-2 bg-blue-500 text-white">
      Sign in with Google
    </button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


