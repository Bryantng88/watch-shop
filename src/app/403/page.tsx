export default function ForbiddenPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-bold text-gray-800">403</h1>
                <p className="text-lg text-gray-600">
                    Bạn không có quyền truy cập trang này
                </p>

                <div className="flex justify-center gap-3">
                    <a
                        href="/admin"
                        className="px-4 py-2 rounded bg-black text-white text-sm"
                    >
                        Quay về Dashboard
                    </a>

                    <a
                        href="/profile"
                        className="px-4 py-2 rounded border text-sm"
                    >
                        Xem quyền của tôi
                    </a>
                </div>
            </div>
        </div>
    );
}
