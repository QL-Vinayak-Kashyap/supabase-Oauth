"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/hooks";
import { setUser } from "@/redux/slices/currentUserSlice";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/utils";
import ReCAPTCHA from "react-google-recaptcha";
// import bcrypt from "bcryptjs";

// const comparePassword = async (
//   password: string,
//   hashedPassword: string
// ): Promise<boolean> => {
//   return await bcrypt.compare(password, hashedPassword);
// };

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cookies, setCokkies] = useState<any>();
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = (data: any) => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }
    setRecaptchaError(false);
    handlelogin(data);
  };

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

      if (userIndex !== -1 && users[userIndex]?.email === email) {
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
          // setTimeout(() => {
          router.push(AppRoutes.DASHBOARD);
          // }, 1000);
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

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: "consent", // forces consent screen even if already authenticated
          },
        },
      });
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      toast("Please check you creds...");
    }
  };

  const handleRecaptchaOnChange = (value) => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
  };

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
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">B</span>
            </div>
            <h1 className="text-3xl font-bold text-purple-800 mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-500">Log in to your WriteEasy account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex flex-col gap-4">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaOnChange}
                theme="light"
                className="transform scale-[0.95] -ml-3"
              />
            </div>
            <div className="pt-2">
              <Button
                disabled={isLoading || recaptchaError}
                type="submit"
                className="w-full py-6 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors"
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

            <div className="mt-6 grid grid-cols-1 gap-3">
              <Button
                onClick={handleGoogleSignIn}
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-3 w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="h-5 w-5"
                />
                <span className="text-sm font-medium text-gray-700">
                  Continue with Google
                </span>
              </Button>
              {/* <Button
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
              </Button> */}
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
            &copy; 2025 WriteEasy. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
