"use server";

import { revalidatePath } from "next/cache";

import {
    refreshZaloTokenForSettings,
    saveZaloNotificationRule,
    saveZaloRecipientGroup,
    setZaloEventEnabled,
    setZaloNotificationRuleEnabled,
} from "@/domains/notification/server/channel-settings.service";
import { requirePermission } from "@/server/auth/requirePermission";

const CHANNEL_SETTINGS_PATH = "/admin/system/channels";

export async function saveZaloRecipientGroupAction(formData: FormData) {
    await requirePermission("SYSTEM_JOB_VIEW");
    await saveZaloRecipientGroup(formData);
    revalidatePath(CHANNEL_SETTINGS_PATH);
}

export async function saveZaloNotificationRuleAction(formData: FormData) {
    await requirePermission("SYSTEM_JOB_VIEW");
    await saveZaloNotificationRule(formData);
    revalidatePath(CHANNEL_SETTINGS_PATH);
}

export async function setZaloNotificationRuleEnabledAction(formData: FormData) {
    await requirePermission("SYSTEM_JOB_VIEW");
    await setZaloNotificationRuleEnabled(formData);
    revalidatePath(CHANNEL_SETTINGS_PATH);
}

export async function setZaloEventEnabledAction(formData: FormData) {
    await requirePermission("SYSTEM_JOB_VIEW");
    await setZaloEventEnabled(formData);
    revalidatePath(CHANNEL_SETTINGS_PATH);
}

export async function refreshZaloTokenAction() {
    await requirePermission("SYSTEM_JOB_VIEW");
    await refreshZaloTokenForSettings();
    revalidatePath(CHANNEL_SETTINGS_PATH);
}
