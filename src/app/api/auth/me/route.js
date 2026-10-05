
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(req) {
  const cookie = req.headers.get("cookie") || "";

  let backendRes;
  try {
    backendRes = await fetch(`${BACKEND}/api/auth/me`, {
      headers: { cookie },
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { success: false, message: "Backend unreachable" },
      { status: 502 }
    );
  }

  return new Response(await backendRes.text(), {
    status: backendRes.status,
    headers: { "Content-Type": "application/json" },
  });
}