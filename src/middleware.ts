// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 토큰이 없는 경우 (로그인하지 않은 경우)
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // 관리자 전용 경로 보호
    if (path.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url)); // 대시보드로 리디렉션
    }

    // 로그인된 사용자는 대시보드 접근 가능
    if (path.startsWith("/dashboard")) {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // 인증 체크를 middleware 함수 내에서 처리
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/dashboard"
  ]
};