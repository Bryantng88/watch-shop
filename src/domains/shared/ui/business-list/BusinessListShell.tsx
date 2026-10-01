import type { ReactNode } from "react";
import { ADMIN_OPERATION_CONTENT_CLASS } from "@/domains/shared/ui/layout/admin-content";

export default function BusinessListShell({
    header,
    filters,
    children,
    pagination,
}: {
    header: ReactNode;
    filters?: ReactNode;
    children: ReactNode;
    pagination?: ReactNode;
}) {
    return (
        <div className={ADMIN_OPERATION_CONTENT_CLASS}>
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
