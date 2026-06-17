import * as z from 'zod';

export const MaintenanceApprovalStatusSchema = z.enum(['NOT_REQUIRED', 'PENDING', 'APPROVED', 'REJECTED'])

export type MaintenanceApprovalStatus = z.infer<typeof MaintenanceApprovalStatusSchema>;