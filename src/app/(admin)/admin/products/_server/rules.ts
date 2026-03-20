// Business rules / config (tách để dễ chỉnh mà không đụng code)
export const MIN_IMAGES = 4;

export const REQUIRED_PRODUCT_FIELDS: { key: string; label: string }[] = [
    { key: 'title', label: 'Tên sản phẩm' },
    { key: 'brandId', label: 'Thương hiệu' },
    { key: 'categoryId', label: 'Category' },
];

export const REQUIRED_VARIANT_FIELDS: { key: string; label: string }[] = [
    { key: 'price', label: 'Giá bán' },
];

export const BASE_REQUIRED_WATCHSPEC_FIELDS: { key: string; label: string }[] = [
    { key: 'ref', label: 'Reference' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Năm sản xuất' },
    { key: 'caseType', label: 'Dạng vỏ' },
    { key: 'movement', label: 'Bộ máy' },
    { key: 'width', label: 'Rộng' },
    { key: 'thickness', label: 'Độ dày' },
    { key: 'dialColor', label: 'Màu mặt số' },
    { key: 'strap', label: 'Dây/Strap' },
    { key: 'glass', label: 'Kính' },
];

export function getRequiredWatchSpecFields(watchSpec?: Record<string, any> | null) {
    const fields = [...BASE_REQUIRED_WATCHSPEC_FIELDS];
    const caseType = String(watchSpec?.caseType ?? '').toUpperCase();
    const caseMaterial = String(watchSpec?.caseMaterial ?? '').toUpperCase();

    if (caseType !== 'ROUND') {
        fields.push({ key: 'length', label: 'Dài' });
    }

    if (caseMaterial === 'GOLD') {
        fields.push({ key: 'goldKarat', label: 'K vàng' });
        fields.push({ key: 'goldColor', label: 'Màu vàng' });
    }

    return fields;
}

// Helper: giá trị được coi là “có”
export function hasValue(x: any) {
    if (x === null || x === undefined) return false;
    if (typeof x === 'string') return x.trim().length > 0;
    if (typeof x === 'number') return Number.isFinite(x);
    if (typeof x === 'boolean') return true;
    if (Array.isArray(x)) return x.length > 0;
    return true;
}
