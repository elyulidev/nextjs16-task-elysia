import { type NextRequest, NextResponse } from "next/server";

export async function refreshTokens(request: NextRequest) {
  try {
    const response = await fetch("http://localhost:3000/api/auth/refresh", {
      method: "POST",
      headers: {
        Cookie: `refresh_token=${request.cookies.get("refresh_token")?.value}`,
      },
    });

    if (!response.ok) throw new Error("Refresh failed");

    // Redirigimos a la misma URL — nueva request con cookies frescas
    const redirectResponse = NextResponse.redirect(request.url);

    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach((cookieString) => {
      redirectResponse.headers.append("Set-Cookie", cookieString);
    });

    return redirectResponse;
  } catch (_) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }
}
