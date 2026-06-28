import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("user_session")?.value;
  const { pathname } = request.nextUrl;

  if (!session) {
    // Redirect to login if trying to access dashboard or admin
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } else {
    // If logged in and visiting login page, redirect to appropriate panel
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // If standard user tries to access admin, redirect to dashboard with unauthorized error
    if (pathname.startsWith("/admin") && session !== "admin") {
      const dashboardUrl = new URL("/dashboard", request.url);
      dashboardUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
