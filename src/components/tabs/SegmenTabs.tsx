"use client";

type Tab = {
    key: string;
    label: string;
    count?: number;
};

export default function SegmentTabs({
    tabs,
    active,
    onChange,
}: {
    tabs: Tab[];
    active: string;
    onChange: (k: string) => void;
}) {
    return (
        <div className="border-b">
            <div className="flex gap-8 items-end">
                {tabs.map((t) => {
                    const isActive = t.key === active;

                    return (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => onChange(t.key)}
                            className={`pb-2 text-sm transition ${isActive
                                ? "border-b-2 border-black font-semibold text-black"
                                : "text-gray-500 hover:text-black"
                                }`}
                        >
                            {t.label}

                            {t.count !== undefined && (
                                <span
                                    className={`ml-2 inline-flex items-center justify-center min-w-7 h-6 px-2 rounded-full text-xs ${isActive
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {t.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}