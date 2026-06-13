import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session/constants";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const MAX_SESSION_REQUESTS = 5;
const MAX_STORE_KEYS = 5_000;

// NOTE: This is an in-memory store and resets on cold starts.
// On serverless deployments with multiple instances (e.g. Vercel) each
// instance maintains its own counter, so the effective limit is
// MAX_REQUESTS * <instance count>. For hard distributed rate limiting,
// replace this with @upstash/ratelimit + @upstash/redis.
const rateLimitStore = new Map<string, number[]>();

const PROTECTED_PATHS = new Set([
  "/api/generate-story",
  "/api/test-connection",
]);

function getClientIp(request: NextRequest): string {
  const forwardedIp = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();

  return (forwardedIp || request.headers.get("x-real-ip") || "unknown").slice(
    0,
    128,
  );
}

function getRateLimitKey(request: NextRequest): string {
  const routeGroup =
    request.nextUrl.pathname === "/api/session" ? "session" : "api";
  return `${routeGroup}:ip:${getClientIp(request)}`;
}

function ensureStoreCapacity(key: string): void {
  if (rateLimitStore.has(key) || rateLimitStore.size < MAX_STORE_KEYS) {
    return;
  }

  const oldestKey = rateLimitStore.keys().next().value;
  if (oldestKey !== undefined) {
    rateLimitStore.delete(oldestKey);
  }
}

function isRateLimited(key: string, maxRequests: number): boolean {
  const now = Date.now();
  const recent = (rateLimitStore.get(key) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (recent.length >= maxRequests) {
    rateLimitStore.delete(key);
    rateLimitStore.set(key, recent);
    return true;
  }

  ensureStoreCapacity(key);
  recent.push(now);
  rateLimitStore.delete(key);
  rateLimitStore.set(key, recent);
  return false;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const maxRequests =
    pathname === "/api/session" ? MAX_SESSION_REQUESTS : MAX_REQUESTS;

  if (isRateLimited(getRateLimitKey(request), maxRequests)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  if (
    PROTECTED_PATHS.has(pathname) &&
    !request.cookies.get(SESSION_COOKIE)?.value
  ) {
    return NextResponse.json(
      { error: "API session required. Enter your API key to continue." },
      { status: 401 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
