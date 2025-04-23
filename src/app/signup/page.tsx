"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
// import bcrypt from "bcryptjs";

// export const hashPassword = async (password: string): Promise<string> => {
//   const saltRounds = 10; // Recommended salt rounds
//   const hashedPassword = await bcrypt.hash(password, saltRounds);
//   return hashedPassword;
// };

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState(true);

  const handleSubmit = (data: any) => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }
    setRecaptchaError(false);
    handleSendOtp(data);
  };

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
      if (!error) {
        router.push("/login");
      }
    } catch (error) {
      toast("Error in SignUp!");
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
          queryParams: {
            prompt: "consent", // forces consent screen even if already authenticated
          },
        },
      });
    } catch (error) {
      toast("Please check you creds...");
      console.log(error);
    }
  };

  const handleRecaptchaOnChange = (value) => {
    setRecaptchaValue(value);
    setRecaptchaError(false);
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

          <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex flex-col gap-4">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaOnChange}
                theme="light"
                className="transform scale-[0.95] -ml-3"
              />
              {recaptchaError && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Please complete the reCAPTCHA</span>
                </div>
              )}
            </div>
            <div className="pt-4">
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

            <div className="mt-6 grid grid-cols-1 gap-3">
              <Button
                onClick={handleGoogleSignIn}
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

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; 2025{" "}
            <span>
              <Link href="/">WriteEasy</Link>
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
