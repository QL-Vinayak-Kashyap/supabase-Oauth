"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/hooks";
import { setUser } from "@/redux/slices/currentUserSlice";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/utils";
// import bcrypt from "bcryptjs";

// const comparePassword = async (
//   password: string,
//   hashedPassword: string
// ): Promise<boolean> => {
//   return await bcrypt.compare(password, hashedPassword);
// };

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cookies, setCokkies] = useState<any>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  async function handlelogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: users, error: fetchError } = await supabase
        .from("users")
        .select("email,status");

      if (fetchError) throw new Error("Error fetching users");
      if (!users || users.length === 0) throw new Error("No users found");
      const userIndex = users.findIndex((item) => item.email === email);
      if (userIndex === -1) {
        throw new Error("User not exist with this email");
      }

      if (
        userIndex !== -1 &&
        users[userIndex]?.email === email &&
        users[userIndex]?.status
      ) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          if (error.message === "Email not confirmed")
            throw new Error(error.message);
          throw new Error("Invalid credentials");
        }

        if (data?.user) {
          Cookies.remove("sb-access-token");
          dispatch(
            setUser({
              isLoggedIn: true,
              email: data.user.email ?? "",
              token: data.session?.access_token,
              full_name: data.user.user_metadata?.full_name,
              id: data.user.id,
            })
          );

          const returnValue = Cookies.set(
            "sb-access-token",
            data.session?.access_token || "",
            {
              secure: true,
              path: AppRoutes.DASHBOARD,
            }
          );
          setCokkies(returnValue);
          setTimeout(() => {
            router.push(AppRoutes.DASHBOARD);
          }, 1000);
          toast("Login Successfully!");
        }
      } else {
        throw new Error("Sorry!!! Please contact the Admin.");
      }
    } catch (err) {
      toast(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  // const handleGoogleSignIn = async () => {
  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider: "google",
  //       options: {
  //         redirectTo: `${window.location.origin}/auth/callback`,
  //       },
  //     });
  //     if (error) {
  //       throw new Error(error.message);
  //     }
  //   } catch (error) {
  //     toast("Please check you creds...");
  //   }
  // };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push(AppRoutes.DASHBOARD); // Redirect if already logged in
      }
    };

    checkSession();
  }, [router, isLoading, cookies]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 rounded-2xl">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">B</span>
            </div>
            <h1 className="text-3xl font-bold text-purple-800 mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-500">Log in to your Blogify account</p>
          </div>

          {/* Form */}
          <form onSubmit={handlelogin} className="space-y-5">
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
                  className="pl-10 border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
              </div>
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
                  className="pl-10 pr-10 border-gray-300 focus:ring-purple-500 focus:border-purple-500"
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
            <div className="pt-2">
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Checking..." : "Submit"}
              </Button>
            </div>
          </form>
          {/* Social Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
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

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href={AppRoutes.SIGNUP}
                className="font-medium text-purple-600 hover:text-purple-800"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; 2025 Blogify. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
