"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaPickerInline from "@/components/media/MediaPickerInline";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";

type ProfileUser = {
    email?: string | null;
    name?: string | null;
    avatarUrl?: string | null;
};

function initials(label?: string | null) {
    const words = String(label || "User").trim().split(/\s+/).filter(Boolean);
    return words.slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join("");
}

export default function ProfileForm({ user }: { user: ProfileUser }) {
    const router = useRouter();
    const [name, setName] = useState(user.name ?? "");
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? "");
    const [loading, setLoading] = useState(false);
    const avatarSrc = resolveMediaPreviewSrc(avatarUrl);

    const submit = async () => {
        if (loading) return;

        setLoading(true);
        await fetch("/api/admin/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                avatarUrl: avatarUrl.trim() || null,
            }),
        });
        setLoading(false);
        router.refresh();
        alert("Da luu thay doi");
    };

    return (
        <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-medium">Thong tin ca nhan</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-[170px_minmax(0,1fr)]">
                <div>
                    <label className="text-sm text-gray-500">Avatar</label>
                    <div className="mt-2 flex items-center gap-4">
                        <MediaPickerInline
                            value={avatarUrl || null}
                            onChange={setAvatarUrl}
                            profile="inline"
                        />
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                            {avatarSrc ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={avatarSrc}
                                    alt={name || "User"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                initials(name)
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <div className="mt-1 font-medium text-gray-900">
                            {user.email ?? "-"}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-500">Ten hien thi</label>
                        <input
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-500">
                            Avatar URL / media key
                        </label>
                        <input
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            value={avatarUrl}
                            onChange={(event) => setAvatarUrl(event.target.value)}
                            placeholder="https://... hoac media key"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={() => void submit()}
                    disabled={loading}
                    className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Dang luu..." : "Luu thay doi"}
                </button>
            </div>
        </div>
    );
}
