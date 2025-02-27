"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
      } else if (data.session) {
        router.push("/dashboard"); // Redirect to a protected page
      }
    };

    handleSession();
  }, [router]);

  return <p>Verifying OTP...</p>;
};

export default AuthCallback;
