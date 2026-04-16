// Business rules / config (tách để dễ chỉnh mà không đụng code)
export const MIN_IMAGES = 4;

// Tập trường watchSpec bắt buộc (tuỳ bạn thêm/bớt)
export const REQUIRED_WATCHSPEC_FIELDS: { key: string; label: string }[] = [
    { key: "model", label: "Model" },
    { key: "year", label: "Năm sản xuất" },
    { key: "caseType", label: "Dạng vỏ" },
    { key: "movement", label: "Bộ máy" },
    { key: "length", label: "Dài" },
    { key: "width", label: "Rộng" },
    { key: "thickness", label: "Độ dày" },
    { key: "dialColor", label: "Màu mặt số" },
    { key: "strap", label: "Dây/Strap" },
    { key: "glass", label: "Kính" },
    { key: "boxIncluded", label: "Kèm hộp" },
    { key: "bookletIncluded", label: "Kèm sổ" },
    { key: "cardIncluded", label: "Kèm thẻ" },
];

// Helper: giá trị được coi là “có”
export function hasValue(x: any) {
    if (x === null || x === undefined) return false;
    if (typeof x === "string") return x.trim().length > 0;
    if (Array.isArray(x)) return x.length > 0;
    return true; // số/bool/object khác -> OK
}
