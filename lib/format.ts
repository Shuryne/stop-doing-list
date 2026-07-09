/** Today's date as an ISO `yyyy-mm-dd` string in the local timezone. */
export function todayISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** "2026-07-08" -> "2026.07.08". Falls back to the raw string if unparseable. */
export function formatDateDot(iso: string): string {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  return `${m[1]}.${m[2]}.${m[3]}`;
}
