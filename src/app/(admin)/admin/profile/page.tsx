// app/(admin)/profile/page.tsx
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return (
        <div className="max-w-xl space-y-6">
            <h1 className="text-xl font-semibold">Thông tin tài khoản</h1>

            <div className="rounded-lg border p-4 space-y-4">
                {/* Email */}
                <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <div className="font-medium">{user.email}</div>
                </div>

                {/* Name */}
                <div>
                    <label className="text-sm text-gray-500">Tên</label>
                    <div className="font-medium">{user.name ?? "-"}</div>
                </div>

                {/* Roles */}
                <div>
                    <label className="text-sm text-gray-500">Roles</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {user.roles.map((role) => (
                            <span
                                key={role}
                                className="px-2 py-1 text-xs rounded bg-gray-100"
                            >
                                {role}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Permissions */}
                <div>
                    <label className="text-sm text-gray-500">Permissions</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {user.permissions.map((code) => (
                            <span
                                key={code}
                                className="px-2 py-0.5 text-[11px] rounded bg-blue-50 text-blue-700"
                            >
                                {code}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
