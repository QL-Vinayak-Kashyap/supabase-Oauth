import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";
// import {createMiddlewareClient} from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const token = await request?.cookies.get("sb-access-token")?.value;

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
  const { data } = await supabase.auth.getUser(token);

  if (data?.user) {
    // Redirect logged-in users away from login page
    if (request.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    // Redirect unauthenticated users away from protected pages
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

// 🔹 Apply middleware only to protected routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
