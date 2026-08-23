const SESSION_KEY = "kt_scroll_positions";

function getAll(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveScrollPosition(path: string, y = window.scrollY): void {
  if (y < 0) return;
  const all = getAll();
  all[path] = y;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(all));
}

export function getScrollPosition(path: string): number {
  return getAll()[path] ?? 0;
}
