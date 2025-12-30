import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { redirect } from "next/navigation";
import ProfileForm from "./_client/ProfileForm";
import ChangePasswordForm from "./_client/ChangePassWordForm";


export default async function ProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return (
        <div className="max-w-xl space-y-6">
            <h1 className="text-xl font-semibold">Profile</h1>

            <ProfileForm user={user} />
            <ChangePasswordForm />
        </div>
    );
}
