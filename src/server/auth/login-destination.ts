// Authentication return paths stay inside the authenticated admin surface.
// Never accept an origin, protocol-relative URL, encoded traversal or backslash.
export function loginDestination(value: unknown) {
  if (
    typeof value !== 'string' ||
    !/^\/admin(?:\/|$)/.test(value) ||
    /[\\\u0000-\u0020]/.test(value)
  )
    return '/admin/dashboard';
  try {
    const decoded = decodeURIComponent(value);
    if (
      /[\\\u0000-\u0020]/.test(decoded) ||
      decoded.split(/[/?#]/).some((part) => part === '.' || part === '..')
    )
      return '/admin/dashboard';
    const url = new URL(value, 'https://admin.invalid');
    return url.origin === 'https://admin.invalid' &&
      /^\/admin(?:\/|$)/.test(url.pathname)
      ? url.pathname + url.search + url.hash
      : '/admin/dashboard';
  } catch {
    return '/admin/dashboard';
  }
}
