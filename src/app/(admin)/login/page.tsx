import { redirect } from "next/navigation";
import LoginForm from "./_client/LoginForm";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { headers } from "next/headers";
import { isLocalAutoLoginEnabled, isLoopbackHost } from "@/server/auth/local-auto-login";

export default async function LoginPage() {
    // 🔥 PHẢI await
    const user = await getCurrentUser();

    if (user) {
        redirect("/admin");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <LoginForm localAutoLogin={isLocalAutoLoginEnabled() && isLoopbackHost((await headers()).get("host"))} />
        </div>
    );
}
