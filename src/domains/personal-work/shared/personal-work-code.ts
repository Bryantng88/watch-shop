export function personalWorkCode(id: string) {
  return "CV-" + id.slice(0, 13).toUpperCase();
}
