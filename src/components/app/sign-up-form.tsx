"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/currentUserSlice";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function SignUpForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [recaptchaError, setRecaptchaError] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const supabase = createClient();
    const dispatch =useDispatch();

    const handleSubmit = (data: any) => {
        if (!recaptchaValue) {
            setRecaptchaError(true);
            return;
        }
        setRecaptchaError(false);
        handleSignUp(data);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data:{full_name:fullName, account_id : crypto.randomUUID() ,total_limit_left: 20, daily_limit: 5},
                    emailRedirectTo: `${window.location.origin}/dashboard/blog-writer`,
                },
            });     
            if (error) throw error;
            router.push("/auth/sign-up-success");
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }   
    };

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
        }
    };

    const handleRecaptchaOnChange = (value) => {
        setRecaptchaValue(value);
        setRecaptchaError(false);
    };

    return (
        // <div className={cn("flex flex-col gap-6", className)} {...props}>
        //   <Card>
        //     <CardHeader>
        //       <CardTitle className="text-2xl">Sign up</CardTitle>
        //       <CardDescription>Create a new account</CardDescription>
        //     </CardHeader>
        //     <CardContent>
        //       <form onSubmit={handleSignUp}>
        //         <div className="flex flex-col gap-6">
        //           <div className="grid gap-2">
        //             <Label htmlFor="email">Email</Label>
        //             <Input
        //               id="email"
        //               type="email"
        //               placeholder="m@example.com"
        //               required
        //               value={email}
        //               onChange={(e) => setEmail(e.target.value)}
        //             />
        //           </div>
        //           <div className="grid gap-2">
        //             <div className="flex items-center">
        //               <Label htmlFor="password">Password</Label>
        //             </div>
        //             <Input
        //               id="password"
        //               type="password"
        //               required
        //               value={password}
        //               onChange={(e) => setPassword(e.target.value)}
        //             />
        //           </div>
        //           <div className="grid gap-2">
        //             <div className="flex items-center">
        //               <Label htmlFor="repeat-password">Repeat Password</Label>
        //             </div>
        //             <Input
        //               id="repeat-password"
        //               type="password"
        //               required
        //               value={repeatPassword}
        //               onChange={(e) => setRepeatPassword(e.target.value)}
        //             />
        //           </div>
        //           {error && <p className="text-sm text-red-500">{error}</p>}
        //           <Button type="submit" className="w-full" disabled={isLoading}>
        //             {isLoading ? "Creating an account..." : "Sign up"}
        //           </Button>
        //         </div>
        //         <div className="mt-4 text-center text-sm">
        //           Already have an account?{" "}
        //           <Link href="/auth/login" className="underline underline-offset-4">
        //             Login
        //           </Link>
        //         </div>
        //       </form>
        //     </CardContent>
        //   </Card>
        // </div>
        <div className="min-h-screen flex items-center justify-center bg-grey-50">
            <div className="w-full max-w-md px-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 mb-4 rounded-ful">
                            <img
                                src="/writeeasy.png"
                                alt="WriteEasy Logo"
                                className=""
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-grey-800 mb-1">
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
                                    className="pl-10 border-gray-300 focus:ring-grey-500 focus:border-grey-500 bg-grey-50/50 border-0 rounded-lg"
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
                                    className="pl-10 border-gray-300 focus:ring-grey-500 focus:border-grey-500 bg-grey-50/50 border-0 rounded-lg"
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
                                    className="pl-10 pr-10 border-gray-300 focus:ring-grey-500 focus:border-grey-500 bg-grey-50/50 border-0 rounded-lg"
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
                                className="w-full transform scale-[0.95] ml-3"
                            />
                        </div>
                        <div className="pt-4">
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

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                href="/auth/login"
                                className="font-medium text-grey-600 hover:text-grey-800"
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
