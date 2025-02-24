import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // Assuming authentication token is stored in cookies

  console.log("token", token);

  const isAuthRoute = req.nextUrl.pathname === '/login'; // Check if the user is visiting the login page
  const isProtectedRoute = req.nextUrl.pathname === '/dashboard'; // Protect dashboard

    if (!token && isProtectedRoute) {
        // Redirect unauthenticated users from /dashboard to /login
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (token && isAuthRoute) {
        // Redirect authenticated users away from /login to /dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next(); // Allow access to all other routes
  
}

export const config = {
  matcher: ['/dashboard', '/login'], // Apply middleware to dashboard and its subroutes
};
