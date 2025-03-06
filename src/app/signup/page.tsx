"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] =useState("");
  const [fullName, setFullName] = useState("")
  const router =useRouter()

  async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,  
        options:{ data:{"full_name":fullName}}
      })

      toast("User Created!!");
      if (data.user) {
        // Insert user details into the "users" table
        const { error: insertError } = await supabase.from("users").insert([
          {
            uuid: data.user.id, // Use the auth user's ID
            email: data.user.email,
            full_name:fullName,
            password:password
            // avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`, // Default avatar
          },
        ]);
  
        if (insertError) {
          console.error("Error inserting user:", insertError.message);
          toast(insertError.message);
        }
      }
      router.push("/login");  
      
    } catch (error) {
      console.log("error",error);
      toast( error.data.message)
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
          <h1 className="text-3xl font-bold">Create Account</h1>
          {/* <p className="text-sm text-muted-foreground">
            Enter the verification code sent to your email
          </p> */}
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">
            {/* <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="bg-secondary/50"
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-secondary/50"
              />
            </div>
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
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary/50"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Creating..." : "Submit"}
            </Button>
          </form>

          <button onClick={handleGoogleSignIn} className="p-2 bg-blue-500 text-white">
      Sign in with Google
    </button>

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

