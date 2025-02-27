import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const token = request.cookies.get("sb-access-token")?.value;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value; // 🔹 Get a single cookie
        },
        set(name, value, options) {
          response.cookies.set(name, value, options); // 🔹 Set a single cookie
        },
        remove(name, options) {
          response.cookies.set(name, "", { ...options, maxAge: -1 }); // 🔹 Remove cookie
        },
      },
    }
  );

  // 🔹 Validate user with token
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    console.log("Invalid token:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

// 🔹 Apply middleware only to protected routes
export const config = {
  matcher: ["/dashboard/:path*"],
};

