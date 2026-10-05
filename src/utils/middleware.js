import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_COOKIE = "access_token";
const REFRESH_ENDPOINT = "/api/auth/refresh";
const PROTECTED_MATCHER = ["/dashboard/:path*"];

function getJwtSecret() {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_ACCESS_SECRET must be set on the server (Next.js env, NOT NEXT_PUBLIC_*)",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Only gate the dashboard segment. Public routes fall through.
  if (!PROTECTED_MATCHER.some((m) => matches(m, pathname))) {
    return NextResponse.next();
  }

  const access = req.cookies.get(ACCESS_COOKIE)?.value;

  if (access) {
    try {
      await jwtVerify(access, getJwtSecret());
      return NextResponse.next();
    } catch {
      // Fall through to silent refresh.
    }
  }

  const API_BASE_URL = process.env.INTERNAL_API_URL || "http://localhost:5000";
  const refreshUrl = new URL(REFRESH_ENDPOINT, API_BASE_URL);
  const refreshRes = await fetch(refreshUrl, {
    method: "POST",
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  if (!refreshRes.ok) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const requestHeaders = new Headers(req.headers);
  const setCookie = refreshRes.headers.get("set-cookie");
  if (setCookie) requestHeaders.set("x-from-refresh", "1");

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  if (setCookie) {
    const cookies = setCookie.split(/,(?=\s*[A-Za-z0-9_-]+=)/);
    for (const c of cookies) res.headers.append("set-cookie", c.trim());
  }
  return res;
}

function matches(pattern, pathname) {
  // Tiny matcher so we don't pull in a regex lib. Supports `:path*` only.
  const idx = pattern.indexOf(":path*");
  if (idx === -1) return pattern === pathname;
  const prefix = pattern.slice(0, idx);
  return pathname.startsWith(prefix);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
