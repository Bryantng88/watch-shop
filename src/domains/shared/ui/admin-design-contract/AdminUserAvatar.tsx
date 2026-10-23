import { resolveMediaPreviewSrc } from "@/lib/media-profile";

export type AdminAvatarUser = {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
};

type AvatarSize = "xs" | "sm" | "md";

const sizeClass: Record<AvatarSize, string> = {
  xs: "h-5 w-5 text-[8px]",
  sm: "h-7 w-7 text-[10px]",
  md: "h-8 w-8 text-xs",
};

function initials(label: string) {
  return label
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function adminUserLabel(user: AdminAvatarUser) {
  return user.name?.trim() || user.email?.trim() || "User";
}

export function AdminUserAvatar({
  user,
  size = "md",
  className = "",
}: {
  user: AdminAvatarUser;
  size?: AvatarSize;
  className?: string;
}) {
  const label = adminUserLabel(user);
  const src = resolveMediaPreviewSrc(user.avatarUrl);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 font-semibold text-slate-600 ring-1 ring-white ${sizeClass[size]} ${className}`}
      title={label}
      aria-label={label}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        initials(label)
      )}
    </span>
  );
}

export function AdminUserAvatarStack({
  users,
  max = 3,
  size = "xs",
}: {
  users: AdminAvatarUser[];
  max?: number;
  size?: AvatarSize;
}) {
  const visible = users.slice(0, max);
  const remaining = Math.max(0, users.length - visible.length);
  const summary = users.map(adminUserLabel).join(", ");

  return (
    <span className="inline-flex items-center -space-x-1" title={summary} aria-label={`Chia sẻ với ${summary}`}>
      {visible.map((user, index) => (
        <AdminUserAvatar
          key={`${user.email || user.name || "user"}-${index}`}
          user={user}
          size={size}
          className="ring-2"
        />
      ))}
      {remaining > 0 && (
        <span className="relative inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1 text-[8px] font-semibold text-slate-600 ring-2 ring-white">
          +{remaining}
        </span>
      )}
    </span>
  );
}

export function AdminUserInlineList({
  users,
  max = 2,
}: {
  users: AdminAvatarUser[];
  max?: number;
}) {
  const visible = users.slice(0, max);
  const remaining = Math.max(0, users.length - visible.length);
  const summary = users.map(adminUserLabel).join(", ");

  return (
    <span className="inline-flex min-w-0 items-center gap-2" title={summary}>
      {visible.map((user, index) => (
        <span key={`${user.email || user.name || "user"}-${index}`} className="inline-flex min-w-0 items-center gap-1">
          <AdminUserAvatar user={user} size="xs" />
          <span className="max-w-28 truncate font-medium text-violet-700">{adminUserLabel(user)}</span>
        </span>
      ))}
      {remaining > 0 && <span className="shrink-0 font-medium text-slate-500">+{remaining}</span>}
    </span>
  );
}
