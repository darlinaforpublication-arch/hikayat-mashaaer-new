import { NextRequest } from "next/server";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sqeibawolsytppnoukne.supabase.co";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function GET(request:NextRequest,{params}:{params:Promise<{path:string[]}>}) {
 const {path}=await params;
 if(!path?.length||!UUID.test(path[0])||path.some(p=>!p||p==="."||p===".."||p.includes("\\"))) return new Response("Not found",{status:404});
 const objectPath=path.map(p=>encodeURIComponent(p)).join("/");
 const upstream=await fetch(`${SUPABASE_URL}/storage/v1/object/public/interactive-games/${objectPath}`,{headers:{Accept:request.headers.get("accept")||"*/*"},cache:"no-store"});
 if(!upstream.ok) return new Response(upstream.status===404?"Game file not found":"Unable to load game file",{status:upstream.status});
 const headers=new Headers();
 headers.set("Content-Type",upstream.headers.get("content-type")||"application/octet-stream");
 headers.set("Content-Disposition","inline");
 headers.set("X-Content-Type-Options","nosniff");
 headers.set("Cache-Control","public, max-age=300");
 const body=await upstream.arrayBuffer();
 return new Response(body,{status:200,headers});
}