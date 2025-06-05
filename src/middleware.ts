import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";
import { AppRoutes } from "./lib/utils";
import { supabase } from "./lib/supabaseClient";
// import {createMiddlewareClient} from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const token = request?.cookies.get("sb-access-token")?.value;

  // 🔹 Validate user with token
  const { data } = await supabase.auth.getUser(token);

  if (data?.user) {
    // Redirect logged-in users away from login page
    if (request.nextUrl.pathname === AppRoutes.LOGIN) {
      return NextResponse.redirect(new URL(AppRoutes.DASHBOARD, request.url));
    }
  } else {
    // Redirect unauthenticated users away from protected pages
    if (request.nextUrl.pathname.startsWith(AppRoutes.DASHBOARD) ) {
      return NextResponse.redirect(new URL(AppRoutes.LOGIN, request.url));
    }
  }

  return response;
}

// 🔹 Apply middleware only to protected routes
export const config = {
  matcher: [`${AppRoutes.DASHBOARD}:path*`, `${AppRoutes.BLOG}:path*` ,  AppRoutes.LOGIN],
};
