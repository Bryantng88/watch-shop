"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { StorefrontLocale } from "../shared/locale.utils";

type LocaleContextValue = { locale: StorefrontLocale; vndPerUsd: number; rateSource: "VIETCOMBANK" | "FALLBACK" };
const LocaleContext = createContext<LocaleContextValue>({ locale: "vi", vndPerUsd: 26_500, rateSource: "FALLBACK" });

export function StorefrontLocaleProvider({ value, children }: { value: LocaleContextValue; children: ReactNode }) {
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useStorefrontLocale() { return useContext(LocaleContext); }
