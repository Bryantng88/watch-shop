import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { redirect } from "next/navigation";

import ProfileForm from "./_client/ProfileForm";
import ChangePasswordForm from "./_client/ChangePasswordForm";
export default async function ProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return (
        <div className="max-w-4xl space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-semibold">Profile</h1>
                <p className="text-sm text-gray-500">
                    Quản lý thông tin tài khoản của bạn
                </p>
            </div>

            <ProfileForm user={user} />
            <ChangePasswordForm />

            <div className="rounded-lg border bg-gray-50 p-6">
                <h2 className="text-sm font-medium text-gray-700 mb-3">
                    Quyền hạn
                </h2>

                <div className="flex flex-wrap gap-2">
                    {user.permissions.map((p) => (
                        <span
                            key={p}
                            className="rounded-full bg-white border px-3 py-1 text-xs text-gray-700"
                        >
                            {p}
                        </span>
                    ))}
                </div>
            </div>

        </div>





    );
}