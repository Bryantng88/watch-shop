'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterContent() {
    const router = useRouter();
    const params = useSearchParams();

    function setParam(key: string, value?: string) {
        const next = new URLSearchParams(params.toString());
        value ? next.set(key, value) : next.delete(key);
        next.delete('page'); // đổi filter reset về page 1
        router.push(`/products?${next.toString()}`);
    }

    const brands = ['Cartier', 'Bulova', 'Omega', 'Longines'];
    const activeBrand = params.get('brand') ?? '';

    return (
        <nav className="space-y-6 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <div>
                <div className="mb-2 text-sm font-medium">Brand</div>
                <ul className="space-y-2">
                    {brands.map((b) => {
                        const checked = activeBrand === b;
                        return (
                            <li key={b} className="flex items-center gap-2">
                                <button
                                    onClick={() => setParam('brand', checked ? undefined : b)}
                                    className={`w-full text-left text-sm px-2 py-1 rounded
                    ${checked ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}
                  `}
                                >
                                    {b}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Price range / style / size... thêm sau nếu cần */}
        </nav>
    );
}
