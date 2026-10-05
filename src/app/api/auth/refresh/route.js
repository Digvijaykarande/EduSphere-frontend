// src/app/api/auth/refresh/route.js
//
// Node-runtime proxy for the backend's POST /api/auth/refresh. The browser
// hits this URL only when the httpOnly `access_token` cookie has expired —
// the Next.js middleware (src/middleware.js) is what calls us. We forward
// the incoming `cookie` header to the backend so it can read
// `refresh_token`, then return the backend's response unchanged so the
// Set-Cookie pair on the response round-trips to the browser.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(req) {
  const cookie = req.headers.get("cookie") || "";

  let backendRes;
  try {
    backendRes = await fetch(`${BACKEND}/api/auth/refresh`, {
      method: "POST",
      headers: { cookie },
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: "Backend unreachable" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // Stream backend response back to the browser, preserving Set-Cookie.
  const headers = new Headers();
  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    // Split multiple Set-Cookie entries safely.
    const cookies = setCookie.split(/,(?=\s*[A-Za-z0-9_-]+=)/);
    for (const c of cookies) headers.append("set-cookie", c.trim());
  }
  headers.set("Content-Type", "application/json");

  return new Response(await backendRes.text(), {
    status: backendRes.status,
    headers,
  });
}