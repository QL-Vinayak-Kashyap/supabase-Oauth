"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import bcrypt from "bcryptjs";

// export const hashPassword = async (password: string): Promise<string> => {
//   const saltRounds = 10; // Recommended salt rounds
//   const hashedPassword = await bcrypt.hash(password, saltRounds);
//   return hashedPassword;
// };

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // const hashedPassword = await hashPassword(password);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { full_name: fullName } },
      });

      toast("User Created!!");
      if (data.user) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            uuid: data.user.id,
            email: data.user.email,
            full_name: fullName,
            password: password,
          },
        ]);

        if (insertError) {
          console.error("Error inserting user:", insertError.message);
          toast(insertError.message);
        }
      }
<<<<<<< HEAD
      if (!error) {
        router.push("/login");
      }
    } catch (error) {
      toast("Error in SignUp!");
=======
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast("Error in Login!");
>>>>>>> 84c5b02 ((fix):Authentication issues.)
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { data } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      toast("Please check you creds...");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="w-full max-w-md px-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-800 mb-1">
              Create Account
            </h1>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 border-gray-300 focus:ring-purple-500 focus:border-purple-500 bg-blue-50/50 border-0 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-gray-300 focus:ring-purple-500 focus:border-purple-500 bg-blue-50/50 border-0 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-gray-300 focus:ring-purple-500 focus:border-purple-500 bg-blue-50/50 border-0 rounded-lg"
                  required
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full py-6 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Checking..." : "Submit"}
              </Button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                disabled
                type="button"
                variant="outline"
                className="py-5 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.033s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.787-1.676-4.139-2.701-6.735-2.701-5.522 0-10.011 4.489-10.011 10.011s4.489 10.011 10.011 10.011c8.025 0 9.939-7.381 9.939-12.467 0-0.772-0.098-1.533-0.214-2.246h-9.725z" />
                </svg>
              </Button>
              <Button
                disabled
                type="button"
                variant="outline"
                className="py-5 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              >
                <svg
                  className="h-5 w-5 text-[#1877F2]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.677 20.895v-7.745H7.687V10.2h1.99V7.86c0-1.97 1.204-3.045 2.965-3.045.84 0 1.562.062 1.77.09v2.054h-1.215c-.95 0-1.135.45-1.135 1.11v2.13h2.273l-.296 2.95h-1.977v7.745" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-purple-600 hover:text-purple-800"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
<<<<<<< HEAD

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; 2025{" "}
            <span>
              <Link href="/">WriteEasy</Link>
            </span>
            . All rights reserved.
          </p>
=======
        <form onSubmit={handleSendOtp} className="space-y-4">
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
        {/* <div className="relative">
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
        </Button> */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
>>>>>>> 84c5b02 ((fix):Authentication issues.)
        </div>
      </div>
    </div>
  );
}
