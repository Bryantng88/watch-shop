import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return (
        <div className="max-w-xl space-y-6">
            <h1 className="text-xl font-semibold">Thông tin tài khoản</h1>

            <div className="rounded-lg border p-4 space-y-3">
                <div>
                    <label className="text-xs text-gray-500">Email</label>
                    <div className="font-medium">{user.email}</div>
                </div>

                <div>
                    <label className="text-xs text-gray-500">Tên</label>
                    <div className="font-medium">{user.name ?? "-"}</div>
                </div>

                <div>
                    <label className="text-xs text-gray-500">Roles</label>
                    <div className="flex gap-2 flex-wrap">
                        {user.roles.map((r) => (
                            <span
                                key={r}
                                className="px-2 py-0.5 text-xs rounded bg-gray-100"
                            >
                                {r}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs text-gray-500">Permissions</label>
                    <div className="flex gap-1 flex-wrap">
                        {user.permissions.map((p) => (
                            <span
                                key={p}
                                className="px-2 py-0.5 text-[11px] rounded bg-blue-50 text-blue-700"
                            >
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
