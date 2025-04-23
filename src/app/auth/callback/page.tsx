"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { setUser } from "@/redux/slices/currentUserSlice";
import { useAppDispatch } from "@/hooks/hooks";
import { AppRoutes } from "@/lib/utils";

export default function AuthCallback() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw new Error("Failed to authenticate");
        }
        const user = session?.user;

        if (user) {
          const { id, email, user_metadata } = user;

          const { error: insertError } = await supabase.from("users").upsert(
            [
              {
                uuid: id,
                email,
                full_name:
                  user_metadata?.full_name || user_metadata?.name || email,
              },
            ],
            {
              onConflict: "email",
            }
          );

          if (insertError) {
            toast.error("Failed to save user info");
          }

          dispatch(
            setUser({
              isLoggedIn: true,
              email: email,
              token: session?.access_token,
              full_name: user_metadata?.full_name || user_metadata?.name,
              id: id,
            })
          );

          Cookies.set("sb-access-token", session?.access_token || "", {
            secure: true,
            path: AppRoutes.DASHBOARD,
          });
          setTimeout(() => {
            router.push(AppRoutes.DASHBOARD);
          }, 1000);
          toast("Login Successfully!");
        } else {
          router.push("/login");
        }
      } catch (error) {
        toast(error?.message);
      }
    };

    getUser();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-lg">
        <svg
          className="animate-spin h-8 w-8 text-purple-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
          ></path>
        </svg>
        <p className="text-lg text-gray-700 font-medium">
          Authenticating your account...
        </p>
      </div>
    </div>
  );
}
