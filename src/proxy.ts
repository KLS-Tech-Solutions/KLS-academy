import { NextResponse, type NextRequest } from "next/server";

/**
 * While NEXT_PUBLIC_LAUNCH_MODE is "coming_soon" every public route is
 * rewritten to the holding page, so the live domain keeps showing the
 * announcement while the full site is built and reviewed on previews.
 * Flip the env var to "live" to open the site.
 */
export function proxy(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_LAUNCH_MODE !== "coming_soon") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/coming-soon")) return NextResponse.next();

  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.svg|icons.svg|.*\\.png$).*)"],
};
