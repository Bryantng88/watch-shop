import * as z from 'zod';

export const MaintenanceEventTypeSchema = z.enum(['ASSIGN_VENDOR', 'CHANGE_VENDOR', 'NOTE', 'COST', 'ESTIMATE', 'DELAY', 'EXTRA_ISSUE', 'COMPLETED', 'CANCELLED'])

export type MaintenanceEventType = z.infer<typeof MaintenanceEventTypeSchema>;