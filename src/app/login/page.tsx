"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handlelogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    let { data: users } = await supabase.from("users").select("email,status");

    const userIndex = users.findIndex((item) => item.email === email);

    if (users[userIndex].email === email && users[userIndex].status) {
      try {
        const {
          data: { user, session },
          error,
        } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) {
          throw new Error(error.message);
        }
        if (user) {
          toast("Login Succesfully!");
          Cookies.set("sb-access-token", session?.access_token || "", {
            secure: true,
          });
          router.push("/dashboard");
        }
      } catch (err) {
        toast(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      toast("Sorry!!! Please contact the Admin.");
    }
  }
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    let { data: users } = await supabase.from("users").select("email,status");

    const userIndex = users.findIndex((item) => item.email === email);

    if (users[userIndex].email === email && users[userIndex].status) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) {
          throw new Error(error.message);
        }
      } catch (error) {
        toast("Please check you creds...");
      }
    } else {
      setIsLoading(false);
      toast("Sorry!!! Please contact the Admin.");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard"); // Redirect if already logged in
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

        {/* -------------------------GOOGLE LOGIN AND SIGNUP PAGE ROUTE --------------------------- */}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#151934] px-2 text-white/40">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 font-medium text-white hover:bg-white/10"
          onClick={handleGoogleSignIn}
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </Button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?
            <Link
              href="/signup"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
