import { NextResponse, type NextRequest } from "next/server";
import { getCaseStudy } from "@/lib/case-studies";

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (!getCaseStudy(slug)) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = { matcher: "/work/:slug" };
