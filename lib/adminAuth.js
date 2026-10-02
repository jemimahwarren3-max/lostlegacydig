// Demo-only passcode gate for the verification queue. This is NOT real
// authentication — it's a single shared passcode, fine for a trusted pilot
// with one or two reviewers, not for a public launch. Replace with real
// accounts (e.g. a Supabase auth or NextAuth) before opening this up.
export function checkAdminPasscode(passcode) {
  const expected = process.env.ADMIN_PASSCODE || "lostlegacy2026";
  return passcode === expected;
}
