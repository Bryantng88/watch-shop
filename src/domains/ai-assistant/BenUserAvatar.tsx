"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
export type BenUserProfile = {
  name?: string | null;
  avatarUrl?: string | null;
};
export function BenUserAvatar({ profile }: { profile?: BenUserProfile }) {
  const label = profile?.name?.trim() || "Bạn",
    parts = label.split(/\s+/),
    initials = (
      parts[0][0] + (parts.length > 1 ? parts.at(-1)![0] : "")
    ).toUpperCase();
  const src = resolveMediaPreviewSrc(profile?.avatarUrl);
  const [failed, setFailed] = useState<string>();
  return (
    <span
      title={label}
      aria-label={label}
      data-ben-user-avatar
      className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-[10px] font-semibold text-violet-700 ring-2 ring-white"
    >
      <span>{initials}</span>
      {src && failed !== src && (
        <img
          src={src}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(src)}
        />
      )}
    </span>
  );
}
