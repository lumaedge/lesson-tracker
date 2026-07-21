import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const publicPaths = ["/login", "/api/auth"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = req.auth.user?.role;
  const url = req.nextUrl.pathname;

  if (url.startsWith("/teacher") && role !== "TEACHER" && role !== "HOD" && role !== "PRINCIPAL") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (url.startsWith("/hod") && role !== "HOD" && role !== "PRINCIPAL") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (url.startsWith("/principal") && role !== "PRINCIPAL") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
