"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";  

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      // const 
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session?.user) {
        // console.log("data",session?.user);
        // Insert user details into Supabase if they don't exist
        const { error: insertError } = await supabase.from("users").upsert([
          {
            uuid: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata.full_name,
            // avatar_url: data.user.user_metadata.avatar_url,
          },
        ]);
    
        if (insertError) {
          console.error("Error inserting Google user:", insertError.message);
        }
      }
      
      Cookies.set("sb-access-token", session?.access_token || "", { secure: true });

      if (error) console.error("Error getting user:", error.message);
      if (session?.access_token) router.push("/dashboard");
      else router.push("/login");
    };

    getUser();
  }, [router]);

  return <p>Processing authentication...</p>;
}