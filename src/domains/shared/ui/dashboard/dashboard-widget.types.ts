import type { ComponentType } from "react";

export type DashboardWidgetSize = "1x1" | "2x1";
export type DashboardWidgetScope = "SHARED" | "WATCH" | "ACQUISITION" | "SPACE";

export type DashboardWidgetDefinition<Key extends string, Props> = {
    key: Key;
    label: string;
    scope: DashboardWidgetScope;
    size: DashboardWidgetSize;
    component: ComponentType<Props>;
};

export type DashboardWidgetRegistry<Key extends string, Props> = Record<
    Key,
    DashboardWidgetDefinition<Key, Props>
>;
