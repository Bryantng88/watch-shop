import * as z from 'zod';

// prettier-ignore
export const maintenanceLogsModelSchema = z.object({
    id: z.string(),
    serviceRequestId: z.string(),
    technicalAssessmentId: z.string().nullable(),
    approvalRequestId: z.string().nullable(),
    sourceType: z.string(),
    category: z.string().nullable(),
    action: z.string().nullable(),
    execution: z.string().nullable(),
    vendorId: z.string().nullable(),
    partId: z.string().nullable(),
    cost: z.number().int(),
    note: z.string().nullable(),
    status: z.string(),
    autoApproved: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    approvalRequests: z.unknown().nullable(),
    technicalAssessments: z.unknown().nullable()
}).strict();

export type maintenanceLogsPureType = z.infer<typeof maintenanceLogsModelSchema>;
