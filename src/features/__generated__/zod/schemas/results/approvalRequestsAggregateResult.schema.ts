import * as z from 'zod';
export const approvalRequestsAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    type: z.number(),
    sourceModule: z.number(),
    serviceRequestId: z.number(),
    technicalAssessmentId: z.number(),
    title: z.number(),
    summary: z.number(),
    status: z.number(),
    autoApproved: z.number(),
    payloadJson: z.number(),
    reviewNote: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    technicalAssessments: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    type: z.string().nullable(),
    sourceModule: z.string().nullable(),
    serviceRequestId: z.string().nullable(),
    technicalAssessmentId: z.string().nullable(),
    title: z.string().nullable(),
    summary: z.string().nullable(),
    status: z.string().nullable(),
    reviewNote: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    type: z.string().nullable(),
    sourceModule: z.string().nullable(),
    serviceRequestId: z.string().nullable(),
    technicalAssessmentId: z.string().nullable(),
    title: z.string().nullable(),
    summary: z.string().nullable(),
    status: z.string().nullable(),
    reviewNote: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});