import * as z from 'zod';

// prettier-ignore
export const approvalRequestsInputSchema = z.object({
    id: z.string(),
    type: z.string(),
    sourceModule: z.string().optional().nullable(),
    serviceRequestId: z.string().optional().nullable(),
    technicalAssessmentId: z.string().optional().nullable(),
    title: z.string(),
    summary: z.string().optional().nullable(),
    status: z.string(),
    autoApproved: z.boolean(),
    payloadJson: z.unknown().optional().nullable(),
    reviewNote: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    technicalAssessments: z.unknown().optional().nullable()
}).strict();

export type approvalRequestsInputType = z.infer<typeof approvalRequestsInputSchema>;
