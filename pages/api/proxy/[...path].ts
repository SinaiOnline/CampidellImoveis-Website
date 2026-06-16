import { API_TOKEN, API_URL } from "@/lib/api";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

function readBody(req: NextApiRequest): Promise<Buffer | undefined> {
  return new Promise((resolve, reject) => {
    if (req.method === "GET" || req.method === "HEAD") {
      return resolve(undefined);
    }

    const chunks: Uint8Array[] = [];

    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = req.url!.replace(/^\/api\/proxy/, "");
  const targetUrl = `${API_URL}${path}`;

  console.log("Proxy →", req.method, targetUrl);

  try {
    const body = await readBody(req);

    // minimal safe headers only
    const headers = new Headers();

    const contentType = req.headers["content-type"];
    const accept = req.headers["accept"];

    if (contentType) headers.set("content-type", contentType as string);
    if (accept) headers.set("accept", accept as string);

    headers.set("Authorization", API_TOKEN);

    // timeout protection
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      signal: controller.signal,
    } as RequestInit);

    clearTimeout(timeout);

    res.status(response.status);

    // forward only safe response headers
    response.headers.forEach((value, key) => {
      const k = key.toLowerCase();
      if (["content-encoding", "transfer-encoding", "connection"].includes(k)) return;
      res.setHeader(key, value);
    });

    const data = await response.arrayBuffer();
    res.send(Buffer.from(data));
  } catch (err: any) {
    console.error("Proxy error:", err?.name, err?.message);

    if (err?.name === "AbortError") {
      return res.status(504).json({ error: "Upstream timeout" });
    }

    return res.status(502).json({ error: "Bad gateway" });
  }
}