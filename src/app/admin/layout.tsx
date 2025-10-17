// app/(admin)/admin/layout.tsx
import AdminTopbar from '@/features/products/_admin/top-bar';
import AdminSidebar from '@/features/products/_admin/side-bar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1">
                <AdminTopbar />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
