// features/admin/products/components/new-product-button.tsx
'use client';

import { useRouter } from 'next/navigation';

interface ProductTypeOption {
    label: string;
    value: string;
}

export default function NewProductButton({ productTypes }: { productTypes: ProductTypeOption[] }) {
    const router = useRouter();
    return (
        <div className="relative">
            <button className="h-9 rounded bg-black px-3 text-white"
                onClick={(e) => {
                    const menu = e.currentTarget.nextSibling as HTMLElement;
                    menu.classList.toggle('hidden');
                }}
            >
                + Thêm sản phẩm
            </button>
            <div className="absolute right-0 mt-2 w-48 rounded border bg-white shadow hidden">
                {productTypes.map((t) => (
                    <button
                        key={t.value}
                        className="block w-full px-3 py-2 text-left hover:bg-gray-50"
                        onClick={() => router.push(`/admin/products/new?type=${t.value}`)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
