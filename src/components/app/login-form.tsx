"use client";

import { AppRoutes } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/currentUserSlice";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState(true);
  const dispatch =useDispatch()

  const handleSubmit = (data: any) => {
    if (!recaptchaValue) {
      setRecaptchaError(true);
      return;
    }
    setRecaptchaError(false);
    handleLogin(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      if(data){
        dispatch(
          setUser({
            isLoggedIn: true,
            email: data.user.email ?? "",
            token: data.session?.access_token,
            full_name: data.user.user_metadata?.full_name ?? 'Admin',
            id: data.user.id,
          })
        )
      }
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push(`${AppRoutes.DASHBOARD}/blog-writer`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data ,error } = await supabase.auth.signInWithOAuth({
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

  return (    
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 mb-4 rounded-ful">
          <img 
            src="/writeeasy.png" 
            alt="WriteEasy Logo" 
            className=""  
          />
          </div>
          <h1 className="text-3xl font-bold text-grey-700 mb-1">
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
                className="pl-10 border-gray-300"
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
                className="pl-10 pr-10 border-gray-300"
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
              className="w-full"
            />
          </div>
          <div className="pt-2">
            <Button 
            variant="default"
              disabled={isLoading || recaptchaError}
              type="submit"
              className="w-full py-6 font-medium rounded-lg transition-colors"
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
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href={`/auth/${AppRoutes.SIGNUP}`}
              className="font-medium text-grey-600 hover:text-rey-800"
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
