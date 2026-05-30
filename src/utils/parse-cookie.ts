export function parseCookies(cookieString: string) {
  const parts = cookieString.split(";").map((p) => p.trim());
  const [nameValue, ...options] = parts;
  const [name, value] = nameValue.split("=");

  const cookieOptions: Record<string, unknown> = {};
  options.forEach((opt) => {
    const [key, val] = opt.split("=");
    const lowerKey = key.toLowerCase();
    if (lowerKey === "httponly") cookieOptions.httpOnly = true;
    if (lowerKey === "secure") cookieOptions.secure = true;
    if (lowerKey === "max-age") cookieOptions.maxAge = parseInt(val, 10);
    if (lowerKey === "path") cookieOptions.path = val;
    if (lowerKey === "samesite") cookieOptions.sameSite = val.toLowerCase();
  });

  return { name, value, cookieOptions };
}
