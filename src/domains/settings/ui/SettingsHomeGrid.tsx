"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, ClipboardList, Settings } from "lucide-react";

type SettingsCard = {
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
};

const SETTINGS_CARDS: SettingsCard[] = [
  {
    title: "Task Types",
    description: "Quản lý danh mục loại công việc như WATCH_IMAGE, WATCH_CONTENT, WATCH_CLEAN, WATCH_PRICE_SALE.",
    href: "/admin/settings/task-types",
    icon: ClipboardList,
    badge: "Task",
  },
];

export default function SettingsHomeGrid() {
  return (
    <div className="mx-auto w-full max-w-[1360px] min-w-0 space-y-6 px-4 py-6 lg:px-5 xl:px-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          <Settings className="h-3.5 w-3.5" /> Settings
        </div>
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">Cấu hình hệ thống</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
          Đây là nơi quản lý các danh mục và cấu hình dùng chung. Các phần này là dữ liệu nền cho nghiệp vụ, không phải dữ liệu vận hành hằng ngày.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SETTINGS_CARDS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
                {item.badge ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{item.badge}</span>
                ) : null}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-slate-950">{item.title}</h2>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
                </div>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
