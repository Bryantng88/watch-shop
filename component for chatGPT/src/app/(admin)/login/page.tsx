import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./_client/LoginForm";

export default async function LoginPage() {
    // 🔥 PHẢI await
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (token) {
        redirect("/admin/orders");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <LoginForm />
        </div>
    );
}