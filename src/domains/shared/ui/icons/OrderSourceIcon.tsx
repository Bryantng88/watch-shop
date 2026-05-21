"use client";

import { Building2, Globe2, Watch } from "lucide-react";
import { DomainSignalIcon } from "./DomainSignalIcon";

export function getOrderSourceIconConfig(source?: string | null) {
  const value = String(source ?? "").toUpperCase();

  if (value === "WEB") {
    return {
      label: "Web",
      title: "Nguồn đơn: Web",
      Icon: Globe2,
    };
  }

  if (value === "WATCH_QUICK_ORDER" || value === "WATCH") {
    return {
      label: "Tạo từ watch",
      title: "Nguồn đơn: Tạo từ watch",
      Icon: Watch,
    };
  }

  return {
    label: "Tạo tay",
    title: "Nguồn đơn: Tạo tay",
    Icon: Building2,
  };
}

type Props = {
  source?: string | null;
  withLabel?: boolean;
  className?: string;
};

export default function OrderSourceIcon({ source, withLabel = false, className }: Props) {
  const config = getOrderSourceIconConfig(source);
  const Icon = config.Icon;

  return (
    <DomainSignalIcon
      title={config.title}
      label={config.label}
      withLabel={withLabel}
      icon={<Icon />}
      className={className}
    />
  );
}