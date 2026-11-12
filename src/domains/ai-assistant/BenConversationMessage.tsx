"use client";
import React, { type ReactNode, type Ref } from "react";
import { BenUserAvatar, type BenUserProfile } from "./BenUserAvatar";
export type { BenUserProfile } from "./BenUserAvatar";
import BenAvatar from "./BenAvatar";
import BenMessage from "./BenMessage";
import type { Message } from "./simulation";
export default function BenConversationMessage({
  message,
  userProfile,
  containerRef,
  children,
}: {
  message: Message;
  userProfile?: BenUserProfile;
  containerRef?: Ref<HTMLDivElement>;
  children?: ReactNode;
}) {
  const user = message.role === "user";
  return (
    <div
      ref={containerRef}
      data-ben-message={message.role}
      className={
        user
          ? "flex items-start justify-end gap-2 pl-8"
          : "flex items-start gap-2.5"
      }
    >
      {!user && (
        <span className="mt-1 shrink-0 [&_img]:h-7 [&_img]:w-7">
          <BenAvatar />
        </span>
      )}
      <div
        data-ben-bubble={message.role}
        className={
          user
            ? "min-w-0 max-w-[88%] whitespace-pre-wrap break-words rounded-3xl rounded-tr-md bg-violet-100/80 px-4 py-3 text-sm leading-6 text-slate-900"
            : "min-w-0 flex-1 break-words py-1 text-slate-800"
        }
      >
        {user ? message.text : <BenMessage text={message.text} />} {children}
      </div>
      {user && <BenUserAvatar profile={userProfile} />}
    </div>
  );
}
