/** Keep filter/search state, but always return to page one after a refinement. */
export function catalogRefinementHref(search: string, patch: Record<string, string | undefined>) {
  const next = new URLSearchParams(search);
  for (const [key, value] of Object.entries(patch)) {
    if (value) next.set(key, value);
    else next.delete(key);
  }
  next.delete("cursor");
  next.delete("page");
  return next.size ? `/products?${next.toString()}` : "/products";
}
