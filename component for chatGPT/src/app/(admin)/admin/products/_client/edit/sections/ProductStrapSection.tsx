"use client";

import * as React from "react";

type Props = {
    children: React.ReactNode;
};

export default function ProductStrapSection({ children }: Props) {
    return (
        <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.5 3h5M9 21h6M8 7h8m-7.25 0-.708 4.25c-.16.964-.24 1.446-.06 1.83.156.334.43.604.767.756.387.174.867.087 1.828-.086h.346c.962.173 1.442.26 1.829.086a1.75 1.75 0 0 0 .767-.756c.18-.384.1-.866-.06-1.83L15.25 7"
                        />
                    </svg>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="text-lg font-semibold text-slate-900">Dây & strap setup</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">
                        Quản lý dây đi kèm, dây lấy từ kho, và các thông tin strap liên quan đến
                        giá vốn hoặc ghép dây.
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                {children}
            </div>
        </div>
    );
}