import { timingSafeEqual } from "node:crypto";

/**
 * Constant-time check of a user-supplied admin token against ADMIN_TOKEN.
 * Returns false if the env var is unset or the lengths differ.
 */
export function adminTokenMatches(provided: string | null | undefined): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
