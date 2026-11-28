/** Display-only intake identity. Never use for storefront titles, slugs or SEO. */
export function vendorIdentityCode(name?: string | null) {
  return (name ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "D").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16);
}

export function intakeIdentitySuffix(vendorName?: string | null, refNo?: string | null) {
  const vendor = vendorIdentityCode(vendorName);
  const ref = (refNo ?? "").trim().replace(/^PN-/, "PN");
  // A draft has no real reference yet. Do not predict the sequence number.
  return ref ? [vendor, ref].filter(Boolean).join("-") : "";
}

export function adminWatchIdentity(title: string, vendorName?: string | null, refNo?: string | null) {
  const suffix = intakeIdentitySuffix(vendorName, refNo);
  return suffix ? `${title} · ${suffix}` : title;
}
