'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
export default function CollapsibleSection({
    title,
    countSelected = 0,
    totalCount,
    onClear,
    children,
    defaultOpen = false,
}: {
    title: string;
    countSelected?: number;
    totalCount?: number;
    onClear?: () => void;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <section>
            {/* Header (click để toggle) */}
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between py-2 text-sm font-semibold"
                aria-expanded={open}
            >
                <span>{title}</span>

                <div className="flex items-center gap-2">
                    {typeof totalCount === 'number' && (
                        <span className="text-xs text-gray-400 font-normal">({totalCount})</span>
                    )}
                    {countSelected > 0 && onClear && (
                        <span
                            onClick={(e) => { e.stopPropagation(); onClear(); }}
                            className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2"
                        >
                            Clear
                        </span>
                    )}
                </div>
            </button>

            {/* Body + animation */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <div className="mt-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
