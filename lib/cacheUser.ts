/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore
if (!globalThis.__cachedUser) {
  // @ts-ignore
  globalThis.__cachedUser = {
    user: null,
    fetched: false,
  };
}

export async function getCachedUser() {
  // @ts-ignore
  const cache = globalThis.__cachedUser;

  if (cache.fetched) return cache.user;

  cache.fetched = true;

  try {
    const res = await fetch("/api/user/me", { cache: "no-store" });

    if (!res.ok) {
      cache.user = null;
      return null;
    }

    const data = await res.json();
    cache.user = data.user;
    return cache.user;
  } catch {
    cache.user = null;
    return null;
  }
}
