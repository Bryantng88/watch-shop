export function personalWorkUpdateLabel(item: {createdAt?:string;updatedAt?:string;activities:{title:string;body:string|null;occurredAt:string}[]}, now=new Date()) {
  const latest = item.activities[0];
  const created = Date.parse(item.createdAt ?? "");
  const changed = Date.parse(item.updatedAt ?? "");
  const activityTime = Date.parse(latest?.occurredAt ?? "");
  const at = Math.max(Number.isFinite(changed)?changed:0,Number.isFinite(activityTime)?activityTime:0);
  if (!at || Number.isFinite(created) && at-created < 1000 && !(latest && activityTime > created)) return null;
  const minutes = Math.max(0,Math.floor((now.getTime()-at)/60000));
  const relative = minutes < 1 ? "vừa xong" : minutes < 60 ? `${minutes} phút trước` : minutes < 1440 ? `${Math.floor(minutes/60)} giờ trước` : new Intl.DateTimeFormat("vi-VN",{day:"2-digit",month:"2-digit",timeZone:"Asia/Bangkok"}).format(at);
  return {label:`Cập nhật ${relative}`,detail:latest && activityTime >= changed-1000 ? [latest.title,latest.body].filter(Boolean).join(": ") : "Thông tin công việc đã thay đổi",at:new Date(at).toISOString()};
}
