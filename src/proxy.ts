import { type NextRequest, NextResponse } from "next/server";
import { refreshTokens } from "./utils/refresh_tokens";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Definir rutas protegidas
  const isProtectedRoute = pathname === "/" || pathname.startsWith("/tasks");

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (isProtectedRoute) {
    // Si no hay access_token pero hay refresh_token, intentamos refrescar accessToken, refreshToken);
    if (!accessToken && refreshToken) {
      return await refreshTokens(request);
    }

    // Si no hay ninguno de los dos, al login
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/tasks/:path*"],
};
