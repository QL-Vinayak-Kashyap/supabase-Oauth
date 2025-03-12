"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function AuthCallback() {
  const router = useRouter();
  const [isValidUser, setIsValidUser] = useState<boolean>(false);

  useEffect(() => {
    const checkUser = async (email: string) => {
      let { data: users } = await supabase.from("users").select("email,status");

      const userIndex = users.findIndex((item) => item.email === email);

      console.log(
        "(users[userIndex].email === email && users[userIndex].status)",
        users,
        users[userIndex]
      );
      if (users[userIndex]?.email === email && users[userIndex]?.status) {
        return true;
      } else {
        return false;
      }
    };

    const getUser = async () => {
      // debugger;
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
          },
        ]);

        // const validity = await checkUser(session.user.email);

        // if (!validity) {
        //   toast("Please contact Admin!");
        // } else {
        //   setIsValidUser(true);
        // }

        if (insertError) {
          console.error("Error inserting Google user:", insertError.message);
        }
      }

      Cookies.set("sb-access-token", session?.access_token || "", {
        secure: true,
      });

      if (error) console.error("Error getting user:", error.message);
      if (session?.access_token) router.push("/dashboard");
      else router.push("/login");
    };

    getUser();
  }, [router]);

  return <p>Processing authentication...</p>;
}
