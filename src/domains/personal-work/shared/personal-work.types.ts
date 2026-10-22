export const PERSONAL_WORK_DOMAINS = [
  { key: "GENERAL", label: "Cá nhân" },
  { key: "WORK", label: "Công việc" },
  { key: "MEDIA", label: "Media" },
  { key: "TECHNICAL", label: "Technical" },
  { key: "SALES", label: "Sales" },
  { key: "ORDER", label: "Đơn hàng" },
  { key: "ACQUISITION", label: "Phiếu nhập" },
] as const;

export type PersonalWorkDomain = (typeof PERSONAL_WORK_DOMAINS)[number]["key"];

export const PERSONAL_WORK_TYPES = {
  GENERAL: [
    { key: "REMINDER", label: "Nhắc việc" },
  ],
  WORK: [
    { key: "GENERAL_TASK", label: "Công việc chung" },
    { key: "MEETING", label: "Họp" },
    { key: "PLANNING", label: "Kế hoạch" },
    { key: "ADMIN", label: "Việc hành chính" },
  ],
  MEDIA: [
    { key: "IMAGE_PROCESSING", label: "Xử lý ảnh" },
    { key: "CONTENT_REVIEW", label: "Kiểm tra nội dung" },
    { key: "MEDIA_POST", label: "Tạo Media Post" },
  ],
  TECHNICAL: [
    { key: "INSPECTION", label: "Kiểm tra kỹ thuật" },
    { key: "REPAIR_FOLLOW_UP", label: "Theo dõi sửa chữa" },
    { key: "PARTS_FOLLOW_UP", label: "Theo dõi linh kiện" },
  ],
  SALES: [
    { key: "CUSTOMER_FOLLOW_UP", label: "Follow-up khách hàng" },
    { key: "QUOTE", label: "Báo giá" },
    { key: "PAYMENT_FOLLOW_UP", label: "Theo dõi thanh toán" },
  ],
  ORDER: [
    { key: "ORDER_PROCESSING", label: "Xử lý đơn hàng" },
    { key: "PAYMENT_COLLECTION", label: "Thu tiền" },
    { key: "SHIPMENT_FOLLOW_UP", label: "Theo dõi giao hàng" },
  ],
  ACQUISITION: [
    { key: "INTAKE_REVIEW", label: "Kiểm tra phiếu nhập" },
    { key: "VENDOR_FOLLOW_UP", label: "Follow-up vendor" },
    { key: "PAYMENT_FOLLOW_UP", label: "Theo dõi thanh toán" },
  ],
} as const satisfies Record<PersonalWorkDomain, readonly { key: string; label: string }[]>;

export type PersonalWorkTargetType = "WATCH" | "ORDER" | "PURCHASE_REQUEST" | "ACQUISITION" | "SERVICE_REQUEST";

export type PersonalWorkTarget = {
  type: PersonalWorkTargetType;
  id: string;
  label: string;
  secondary: string | null;
  href: string;
};

export type PersonalWorkItem = {
  id: string;
  title: string;
  note: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueAt: string | null;
  completedAt: string | null;
  domain: PersonalWorkDomain;
  workType: string | null;
  target: PersonalWorkTarget | null;
  tags: string[];
  calendar: { synced: boolean; htmlLink: string | null; lastSyncedAt: string | null };
  access: "OWNER" | "EDITOR" | "VIEWER";
  owner: PersonalWorkUser;
  sharedWith: PersonalWorkShare[];
};

export type PersonalWorkUser = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
};

export type PersonalWorkShare = {
  user: PersonalWorkUser;
  accessLevel: "VIEWER" | "EDITOR";
};

export type PersonalCalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string | null;
  allDay: boolean;
  htmlLink: string | null;
  location: string | null;
  linkedTaskItemId: string | null;
};

export type PersonalWorkPageData = {
  items: PersonalWorkItem[];
  currentUserId: string;
  availableUsers: PersonalWorkUser[];
  calendar: {
    configured: boolean;
    connected: boolean;
    accountEmail: string | null;
    lastSyncedAt: string | null;
    events: PersonalCalendarEvent[];
    loadError: string | null;
  };
};
