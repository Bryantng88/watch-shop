import { ADMIN_UI_FOUNDATION as F } from "../admin-design-contract/admin-ui.foundation";

/** Quiet list metadata; all channel names remain readable on keyboard and touch. */
export function PostTargetSummary({ targets }: { targets: { name: string; platform?: string | null }[] }) {
  const channels = Array.from(new Map(targets.map(target => [target.name.trim().toLocaleLowerCase("vi-VN"), target])).values());
  const description = targets.map(target => [target.name, target.platform].filter(Boolean).join(" · ")).join(", ");
  return <span title={description} aria-label={`Kênh đăng: ${description}`} style={{
    color: F.colors.body, fontSize: F.typography.metadata.size,
    lineHeight: `${F.typography.metadata.lineHeight}px`, fontWeight: F.typography.metadata.weight,
    overflowWrap: "anywhere",
  }}>{channels.map(target => target.name).join(" · ")}</span>;
}
