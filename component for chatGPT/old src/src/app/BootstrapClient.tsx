// src/app/BootstrapClient.tsx
"use client";
import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    import("bootstrap");
  }, []);
  return null;
}
