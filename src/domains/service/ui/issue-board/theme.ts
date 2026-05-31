import type { BoardColumnKey } from "./types";


export function getColumnStyleOld(key: BoardColumnKey) {
  if (key === "PENDING_CONFIRM") {
    return {
      wrap: "border-[#E7C873] bg-[#FFF9EA]",
      head: "text-[#8A6116]",
      badge: "border-[#E7C873] bg-white text-[#A56B00]",
      ring: "ring-[#E7C873]",
    };
  }
  if (key === "READY") {
    return {
      wrap: "border-[#BCD8F4] bg-[#F5FAFF]",
      head: "text-[#225B8F]",
      badge: "border-[#BCD8F4] bg-white text-[#2F75B5]",
      ring: "ring-[#9EC6EF]",
    };
  }
  if (key === "IN_PROGRESS") {
    return {
      wrap: "border-[#C9C4F5] bg-[#F8F6FF]",
      head: "text-[#5642A6]",
      badge: "border-[#C9C4F5] bg-white text-[#6A56C9]",
      ring: "ring-[#B4ACEF]",
    };
  }
  return {
    wrap: "border-[#BFE6C8] bg-[#F3FCF5]",
    head: "text-[#2E7D4A]",
    badge: "border-[#BFE6C8] bg-white text-[#329A59]",
    ring: "ring-[#9FD7AE]",
  };
}

export function getColumnStyle(key: BoardColumnKey) {
  switch (key) {
    case "PENDING_CONFIRM":
      return {
        wrap: "border-[#E7C873] bg-[#FFF9EA]",
        head: "text-[#8A6116]",
        badge: "border-[#E7C873] bg-white text-[#A56B00]",
        ring: "ring-[#E7C873]",
      };

    case "READY":
      return {
        wrap: "bg-sky-50 border-sky-100",
        header: "text-sky-700",
        badge: "bg-sky-100 text-sky-700",
      };

    case "IN_PROGRESS":
      return {
        wrap: "bg-violet-50 border-violet-100",
        header: "text-violet-700",
        badge: "bg-violet-100 text-violet-700",
      };

    case "DONE":
      return {
        wrap: "bg-emerald-50 border-emerald-100",
        header: "text-emerald-700",
        badge: "bg-emerald-100 text-emerald-700",
      };

    default:
      return {
        wrap: "bg-stone-50 border-stone-200",
        header: "text-stone-700",
        badge: "bg-stone-100 text-stone-700",
      };
  }
}

export function getAreaAccentOld(area?: string | null) {
  const raw = String(area || "").toUpperCase();

  if (raw === "MOVEMENT") {
    return {
      topBar: "bg-[#1F9D8B]",
      headerBg: "bg-[#EFF6FF]",
      headerBorder: "border-blue-200",
      chip: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }
  if (raw === "CASE") {
    return {
      topBar: "bg-[#3B82F6]",
      headerBg: "bg-stone-50",
      headerBorder: "border-stone-200",
      chip: "border-sky-200 bg-sky-50 text-sky-700",
    };
  }
  if (raw === "CRYSTAL") {
    return {
      topBar: "bg-[#8A6FD1]",
      headerBg: "bg-stone-50",
      headerBorder: "border-stone-200",
      chip: "border-slate-200 bg-slate-50 text-slate-700",
    };
  }
  if (raw === "DIAL") {
    return {
      topBar: "bg-[#64748B]",
      headerBg: "bg-stone-50",
      headerBorder: "border-stone-200",
      chip: "border-gray-200 bg-gray-50 text-gray-700",
    };
  }
  if (raw === "CROWN") {
    return {
      topBar: "bg-[#71717A]",
      headerBg: "bg-stone-50",
      headerBorder: "border-stone-200",
      chip: "border-zinc-200 bg-zinc-50 text-zinc-700",
    };
  }

  return {
    topBar: "bg-[#8F8A83]",
    headerBg: "bg-stone-50",
    headerBorder: "border-stone-200",
    chip: "border-stone-200 bg-stone-100 text-stone-700",
  };
}

export function getAreaAccent(area?: string | null) {
  const raw = String(area || "").toUpperCase();

  if (raw === "MOVEMENT") {
    return {
      topBar: "bg-[#3B82F6]",
      headerBg: "bg-[#EFF6FF]",
      headerBorder: "border-blue-200",
      chip: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  // tất cả còn lại unified
  return {
    topBar: "bg-[#71717A]",
    headerBg: "bg-stone-50",
    headerBorder: "border-stone-200",
    chip: "border-sky-200 bg-sky-50 text-sky-700",
  };
}
