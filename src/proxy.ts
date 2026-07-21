import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const publicPaths = ["/login", "/api/auth"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const session = await auth();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = session.user.role;

  if (pathname.startsWith("/teacher") && role !== "TEACHER" && role !== "HOD" && role !== "PRINCIPAL") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/hod") && role !== "HOD" && role !== "PRINCIPAL") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/principal") && role !== "PRINCIPAL") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
