import { redirect } from "next/navigation";
import LoginForm from "./_client/LoginForm";
import { getCurrentUser } from "@/server/auth/getCurrentUser";

export default async function LoginPage() {
    // 🔥 PHẢI await
    const user = await getCurrentUser();

    if (user) {
        redirect("/admin/orders");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <LoginForm />
        </div>
    );
}
