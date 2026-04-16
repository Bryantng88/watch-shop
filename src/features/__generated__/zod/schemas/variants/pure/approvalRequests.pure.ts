import * as z from 'zod';

// prettier-ignore
export const approvalRequestsModelSchema = z.object({
    id: z.string(),
    type: z.string(),
    sourceModule: z.string().nullable(),
    serviceRequestId: z.string().nullable(),
    technicalAssessmentId: z.string().nullable(),
    title: z.string(),
    summary: z.string().nullable(),
    status: z.string(),
    autoApproved: z.boolean(),
    payloadJson: z.unknown().nullable(),
    reviewNote: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    technicalAssessments: z.unknown().nullable()
}).strict();

export type approvalRequestsPureType = z.infer<typeof approvalRequestsModelSchema>;
