import type { ReactNode } from "react";

export default function BusinessListShell({
    header,
    dashboard,
    filters,
    children,
    pagination,
}: {
    header: ReactNode;
    dashboard?: ReactNode;
    filters?: ReactNode;
    children: ReactNode;
    pagination?: ReactNode;
}) {
    return (
        <div className="mx-auto w-full max-w-[1440px] min-w-0 space-y-4 px-4 pb-8 pt-6 lg:px-5 xl:px-6">
            {header}
            {dashboard}
            {filters ? (
                <div className="space-y-0">
                    {filters}
                    {children}
                </div>
            ) : (
                children
            )}
            {pagination}
        </div>
    );
}
