export const PERSONAL_WORK_DOMAINS = [
  { key: "GENERAL", label: "Cá nhân" },
  { key: "MEDIA", label: "Media" },
  { key: "TECHNICAL", label: "Technical" },
  { key: "SALES", label: "Sales" },
  { key: "ORDER", label: "Đơn hàng" },
  { key: "ACQUISITION", label: "Phiếu nhập" },
] as const;

export type PersonalWorkDomain = (typeof PERSONAL_WORK_DOMAINS)[number]["key"];

export type PersonalWorkItem = {
  id: string;
  title: string;
  note: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueAt: string | null;
  completedAt: string | null;
  domain: PersonalWorkDomain;
  tags: string[];
  calendar: { synced: boolean; htmlLink: string | null; lastSyncedAt: string | null };
};

export type PersonalWorkPageData = {
  items: PersonalWorkItem[];
  calendar: {
    configured: boolean;
    connected: boolean;
    accountEmail: string | null;
    lastSyncedAt: string | null;
  };
};
