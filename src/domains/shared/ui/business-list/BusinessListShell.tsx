import type { ReactNode } from "react";
import { ADMIN_OPERATION_CONTENT_CLASS } from "@/domains/shared/ui/layout/admin-content";

export default function BusinessListShell({
    header,
    filters,
    children,
    pagination,
    className = "",
}: {
    header: ReactNode;
    filters?: ReactNode;
    children: ReactNode;
    pagination?: ReactNode;
    className?: string;
}) {
    return (
        <div className={`${ADMIN_OPERATION_CONTENT_CLASS} ${className}`}>
            {header}
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
