export type PersonalPhotoshootPlan = {
  id: string; title: string; dueAt: string; scheduledEndAt: string | null; watchCount: number;
};
export type PersonalPhotoshootInput = { watchId: string; date: string; taskItemId?: string | null; note?: string };
export type PersonalPhotoshootResult = {
  id: string; title: string; watchCount: number; outcome: "CREATED" | "ADDED" | "UPDATED" | "ALREADY_LINKED";
};

export function personalPhotoshootDay(date: string) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new Error("Ngày chụp không hợp lệ");
  const start = new Date(`${date}T00:00:00+07:00`);
  return { start, end: new Date(start.getTime() + 86400000), dueAt: new Date(`${date}T23:59:59.999+07:00`) };
}
