import { createServerFn } from "@tanstack/react-start";
import { createHash, timingSafeEqual } from "node:crypto";

function matches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { user: string; password: string }) => ({
    user: String(data.user ?? "").slice(0, 100),
    password: String(data.password ?? "").slice(0, 100),
  }))
  .handler(async ({ data }) => {
    const user = process.env["ADMIN_USER"];
    const password = process.env["ADMIN_PASSWORD"];
    if (!user || !password) return { ok: false as const };
    const ok = matches(data.user, user) && matches(data.password, password);
    return { ok };
  });
