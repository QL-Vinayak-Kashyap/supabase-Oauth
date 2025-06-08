// import { createServerClient } from "@supabase/ssr";
// import { NextResponse, NextRequest } from "next/server";
// import { AppRoutes } from "./lib/utils";
// import { supabase } from "./lib/supabaseClient";
// // import {createMiddlewareClient} from "@supabase/auth-helpers-nextjs"

// export async function middleware(request: NextRequest) {
//   const response = NextResponse.next();

//   const token = request?.cookies.get("sb-access-token")?.value;

//   // 🔹 Validate user with token
//   const { data } = await supabase.auth.getUser(token);

//   if (data?.user) {
//     // Redirect logged-in users away from login page
//     if (request.nextUrl.pathname === AppRoutes.LOGIN) {
//       return NextResponse.redirect(new URL(AppRoutes.DASHBOARD, request.url));
//     }
//   } else {
//     // Redirect unauthenticated users away from protected pages
//     if (request.nextUrl.pathname.startsWith(AppRoutes.DASHBOARD) ) {
//       return NextResponse.redirect(new URL(AppRoutes.LOGIN, request.url));
//     }
//   }

//   return response;
// }

// // 🔹 Apply middleware only to protected routes
// export const config = {
//   matcher: [`${AppRoutes.DASHBOARD}:path*`, `${AppRoutes.BLOG}:path*` ,  AppRoutes.LOGIN],
// };

import { updateSession } from "@/utils/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
