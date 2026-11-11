export function personalWorkCode(id: string, number?: number | null) {
  return "CV-" + (number ?? id.slice(0, 13).toUpperCase());
}
