"use client";
import { createContext, useContext, type ReactNode } from "react";
const ShellHeadingContext = createContext(false);
export function AdminShellHeadingProvider({children, enabled = true}: {children: ReactNode; enabled?: boolean}) { return <ShellHeadingContext.Provider value={enabled}>{children}</ShellHeadingContext.Provider>; }
export function useAdminShellHeading() { return useContext(ShellHeadingContext); }
/** Standalone/embedded pages retain their heading; the admin shell owns it otherwise. */
export function AdminPageHeading({children, className}: {children: ReactNode; className?: string}) { const shell = useAdminShellHeading(); return shell ? null : <h1 className={className}>{children}</h1>; }
