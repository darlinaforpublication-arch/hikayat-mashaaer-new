import { NextRequest } from "next/server";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://sqeibawolsytppnoukne.supabase.co";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MIME_TYPES: Record<string, string> = {
  html: "text/html; charset=utf-8",
  htm: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  ico: "image/x-icon",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  wasm: "application/wasm",\n  pdf: "application/pdf",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;

  if (
    !path?.length ||
    !UUID.test(path[0]) ||
    path.some((part) => !part || part === "." || part === ".." || part.includes("\\"))
  ) {
    return new Response("Not found", { status: 404 });
  }

  const objectPath = path.map(encodeURIComponent).join("/");
  const upstream = await fetch(
    `${SUPABASE_URL}/storage/v1/object/public/interactive-games/${objectPath}`,
    {
      headers: { Accept: request.headers.get("accept") || "*/*" },
      cache: "no-store",
    },
  );

  if (!upstream.ok) {
    return new Response(
      upstream.status === 404 ? "Game file not found" : "Unable to load game file",
      { status: upstream.status },
    );
  }

  const extension = path[path.length - 1].split(".").pop()?.toLowerCase() || "";
  const contentType =
    MIME_TYPES[extension] ||
    upstream.headers.get("content-type") ||
    "application/octet-stream";

  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("Content-Disposition", "inline");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Cache-Control", "public, max-age=300");

  return new Response(await upstream.arrayBuffer(), { status: 200, headers });
}
