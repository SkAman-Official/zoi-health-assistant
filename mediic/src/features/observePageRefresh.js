// Refresh read-only data in visible pages and when returning to a tab.
export function observePageRefresh(callback, {
  windowImpl = window,
  documentImpl = document,
  intervalMs = 30000
} = {}) {
  const refreshVisible = () => {
    if (!documentImpl.hidden) callback();
  };
  const timer = windowImpl.setInterval(refreshVisible, intervalMs);
  windowImpl.addEventListener("focus", refreshVisible);
  documentImpl.addEventListener("visibilitychange", refreshVisible);
  return () => {
    windowImpl.clearInterval(timer);
    windowImpl.removeEventListener("focus", refreshVisible);
    documentImpl.removeEventListener("visibilitychange", refreshVisible);
  };
}
