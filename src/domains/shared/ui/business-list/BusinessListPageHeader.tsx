import type { ReactNode } from "react";

type BusinessListPageHeaderProps = {
    title: ReactNode;
    icon: ReactNode;
    meta?: ReactNode;
    actions?: ReactNode;
};

export default function BusinessListPageHeader({
    title,
    icon,
    meta,
    actions,
}: BusinessListPageHeaderProps) {
    return (
        <header className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-r from-white via-violet-50/20 to-violet-100/65 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] md:flex-row md:items-center md:justify-between">
            <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-violet-500 to-indigo-500" />

            <div className="flex min-w-0 items-center gap-3 pl-1">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-200">
                    {icon}
                </span>
                <div className="min-w-0">
                    <h1 className="text-2xl font-semibold tracking-[-0.02em] text-slate-950">
                        {title}
                    </h1>
                    {meta ? (
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                            {meta}
                        </div>
                    ) : null}
                </div>
            </div>

            {actions ? (
                <div className="flex flex-wrap items-center gap-2 pl-14 md:pl-0">
                    {actions}
                </div>
            ) : null}
        </header>
    );
}
