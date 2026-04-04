import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { roleFromToken } from "@/lib/role-from-token";

const AUTH_ROUTES = ["/login", "/signup"];

const ROLE_PREFIXES = ["/recruiter", "/candidate", "/admin"] as const;

function isProtectedAppPath(pathname: string): boolean {
  return ROLE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function redirectPanelToNewRoutes(
  request: NextRequest,
  pathname: string,
  token: string
) {
  const role = roleFromToken(token);
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const trimmed = pathname.replace(/\/$/, "");
  if (trimmed === "/panel") {
    return NextResponse.redirect(new URL(`/${role}`, request.url));
  }

  const sub = pathname.replace(/^\/panel\/?/, "").replace(/\/$/, "");
  if (!sub) {
    return NextResponse.redirect(new URL(`/${role}`, request.url));
  }

  const pathRole = sub.split("/")[0];
  if (
    pathRole === "candidate" ||
    pathRole === "recruiter" ||
    pathRole === "admin"
  ) {
    if (pathRole === role) {
      return NextResponse.redirect(new URL(`/${sub}`, request.url));
    }
    return NextResponse.redirect(new URL(`/${role}`, request.url));
  }

  return NextResponse.redirect(new URL(`/${role}`, request.url));
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAuthRoute && token) {
    const role = roleFromToken(token);
    const home = role ? `/${role}` : "/";
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (pathname.startsWith("/panel")) {
    if (!token) {
      const login = new URL("/login", request.url);
      login.searchParams.set("from", pathname);
      return NextResponse.redirect(login);
    }
    return redirectPanelToNewRoutes(request, pathname, token);
  }

  if (isProtectedAppPath(pathname) && !token) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  if (token && isProtectedAppPath(pathname)) {
    const role = roleFromToken(token);
    if (!role) {
      return NextResponse.next();
    }
    const pathRole = pathname.split("/")[1];
    if (
      (pathRole === "recruiter" ||
        pathRole === "candidate" ||
        pathRole === "admin") &&
      pathRole !== role
    ) {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/panel",
    "/panel/:path*",
    "/recruiter",
    "/recruiter/:path*",
    "/candidate",
    "/candidate/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
