import * as z from 'zod';

// prettier-ignore
export const maintenanceLogsInputSchema = z.object({
    id: z.string(),
    serviceRequestId: z.string(),
    technicalAssessmentId: z.string().optional().nullable(),
    approvalRequestId: z.string().optional().nullable(),
    sourceType: z.string(),
    category: z.string().optional().nullable(),
    action: z.string().optional().nullable(),
    execution: z.string().optional().nullable(),
    vendorId: z.string().optional().nullable(),
    partId: z.string().optional().nullable(),
    cost: z.number().int(),
    note: z.string().optional().nullable(),
    status: z.string(),
    autoApproved: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    approvalRequests: z.unknown().optional().nullable(),
    technicalAssessments: z.unknown().optional().nullable()
}).strict();

export type maintenanceLogsInputType = z.infer<typeof maintenanceLogsInputSchema>;
