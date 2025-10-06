"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterContent() {
    const router = useRouter();
    const params = useSearchParams();

    function setParam(key: string, value?: string) {
        const next = new URLSearchParams(params.toString());
        value ? next.set(key, value) : next.delete(key);
        router.push(`/products?${next.toString()}`);
    }

    return (
        <nav className="space-y-4">
            <div>
                <div className="mb-2 text-sm font-medium">Brand</div>
                <div className="flex flex-col gap-2">
                    {["Cartier", "Bulova", "Omega", "Longines"].map((b) => (
                        <button
                            key={b}
                            onClick={() => setParam("brand", b)}
                            className="text-left text-sm hover:underline"
                        >
                            {b}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price range / Style / Size... tương tự */}
        </nav>
    );
}
