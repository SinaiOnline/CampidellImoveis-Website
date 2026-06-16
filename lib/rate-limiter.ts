import type { NextApiRequest, NextApiResponse } from "next";

type Entry = { count: number; reset: number };

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60;

const store = new Map<string, Entry>();

export default function rateLimit(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ??
    req.socket.remoteAddress ??
    "unknown";

  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || entry.reset < now) {
    store.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    res.status(429).json({ error: "Too many requests" });
    return false;
  }

  entry.count++;
  return true;
}

/* Prevent unbounded memory growth */
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of store) {
    if (entry.reset < now) store.delete(ip);
  }
}, WINDOW_MS);