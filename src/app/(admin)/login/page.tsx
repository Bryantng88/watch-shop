import {loginDestination} from "@/server/auth/login-destination";
import { redirect } from "next/navigation";
import LoginForm from "./_client/LoginForm";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { headers } from "next/headers";
import { isLocalAutoLoginEnabled, isLoopbackHost } from "@/server/auth/local-auto-login";

export default async function LoginPage({searchParams}: {searchParams: Promise<{next?:string|string[]}>}) {
    const destination=loginDestination((await searchParams).next);
    // 🔥 PHẢI await
    const user = await getCurrentUser();

    if (user) {
        redirect(destination);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <LoginForm destination={destination} localAutoLogin={isLocalAutoLoginEnabled() && isLoopbackHost((await headers()).get("host"))} />
        </div>
    );
}
