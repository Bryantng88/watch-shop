import type { CSSProperties, ReactNode } from "react";

type DashboardWidgetGridProps = {
    children: ReactNode;
    columns?: string;
    className?: string;
    ariaLabel?: string;
};

type DashboardWidgetCardProps = {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
};

export function DashboardWidgetGrid({
    children,
    columns = "xl:grid-cols-4",
    className = "",
    ariaLabel,
}: DashboardWidgetGridProps) {
    return (
        <div
            className={`grid grid-cols-1 gap-3 lg:grid-cols-2 ${columns} ${className}`}
            aria-label={ariaLabel}
        >
            {children}
        </div>
    );
}

export function DashboardWidgetCard({
    children,
    className = "",
    style,
}: DashboardWidgetCardProps) {
    return (
        <article
            className={`min-h-[190px] rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.035)] ${className}`}
            style={style}
        >
            {children}
        </article>
    );
}
