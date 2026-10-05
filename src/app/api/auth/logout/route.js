// src/app/api/auth/logout/route.js
//
// Optional convenience proxy. The browser-side api.logout() hits the
// backend directly. This route is here for parity and to make SSR logout
// possible.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function POST(req) {
  const cookie = req.headers.get("cookie") || "";

  let backendRes;
  try {
    backendRes = await fetch(`${BACKEND}/api/auth/logout`, {
      method: "POST",
      headers: { cookie },
    });
  } catch {
    return Response.json(
      { success: false, message: "Backend unreachable" },
      { status: 502 }
    );
  }

  const headers = new Headers({ "Content-Type": "application/json" });
  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    const cookies = setCookie.split(/,(?=\s*[A-Za-z0-9_-]+=)/);
    for (const c of cookies) headers.append("set-cookie", c.trim());
  }

  return new Response(await backendRes.text(), {
    status: backendRes.status,
    headers,
  });
}