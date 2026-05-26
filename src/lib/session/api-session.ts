import { cookies } from "next/headers";
import { ProviderType } from "@/types/llm";
import { SESSION_COOKIE } from "@/lib/session/constants";

export { SESSION_COOKIE };

const SESSION_TTL_SEC = 24 * 60 * 60;

interface SessionPayload {
  apiKeyManager: Partial<Record<ProviderType, string>>;
  exp: number;
}

// ─── Web Crypto helpers (Edge + Node.js ≥15 + Cloudflare Workers) ────────────

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (padded.length % 4)) % 4;
  const base64 = padded + "=".repeat(padding);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Module-level key cache: derived once per isolate lifetime.
let _keyCache: CryptoKey | null = null;

async function getEncryptionKey(): Promise<CryptoKey> {
  if (_keyCache) return _keyCache;

  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET environment variable is required");
  }

  const enc = new TextEncoder();
  const rawKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret || "dev-insecure-session-secret"),
    "HKDF",
    false,
    ["deriveKey"],
  );

  _keyCache = await crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: enc.encode("jade-compass"),
      info: new Uint8Array(),
    },
    rawKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );

  return _keyCache;
}

// ─── Encrypt / Decrypt ───────────────────────────────────────────────────────
// Wire format: iv(12 bytes) | AES-GCM ciphertext+tag (N+16 bytes), base64url.
// Web Crypto AES-GCM appends the 16-byte auth tag automatically.

export async function encryptSessionPayload(
  payload: Omit<SessionPayload, "exp">,
): Promise<string> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = JSON.stringify({
    ...payload,
    exp: Date.now() + SESSION_TTL_SEC * 1000,
  });

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(data),
  );

  const combined = new Uint8Array(12 + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), 12);
  return toBase64Url(combined);
}

export async function decryptSessionPayload(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const buf = fromBase64Url(token);
    const iv = buf.slice(0, 12);
    const ciphertext = buf.slice(12);
    const key = await getEncryptionKey();

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext,
    );

    const payload = JSON.parse(
      new TextDecoder().decode(decrypted),
    ) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

export async function readSessionApiKeys(): Promise<Partial<
  Record<ProviderType, string>
> | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await decryptSessionPayload(token);
  return payload?.apiKeyManager ?? null;
}

export async function writeSessionCookie(
  apiKeyManager: Partial<Record<ProviderType, string>>,
): Promise<void> {
  const cookieStore = await cookies();
  const token = await encryptSessionPayload({ apiKeyManager });
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_SEC,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function getSessionRateLimitId(token: string | undefined): string {
  if (token) return `session:${token.slice(0, 32)}`;
  return "anonymous";
}
