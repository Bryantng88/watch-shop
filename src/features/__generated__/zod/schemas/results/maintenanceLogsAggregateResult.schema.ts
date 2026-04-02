import * as z from 'zod';
export const maintenanceLogsAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    serviceRequestId: z.number(),
    technicalAssessmentId: z.number(),
    approvalRequestId: z.number(),
    sourceType: z.number(),
    category: z.number(),
    action: z.number(),
    execution: z.number(),
    vendorId: z.number(),
    partId: z.number(),
    cost: z.number(),
    note: z.number(),
    status: z.number(),
    autoApproved: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    approvalRequests: z.number(),
    technicalAssessments: z.number()
  }).optional(),
  _sum: z.object({
    cost: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    cost: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    serviceRequestId: z.string().nullable(),
    technicalAssessmentId: z.string().nullable(),
    approvalRequestId: z.string().nullable(),
    sourceType: z.string().nullable(),
    category: z.string().nullable(),
    action: z.string().nullable(),
    execution: z.string().nullable(),
    vendorId: z.string().nullable(),
    partId: z.string().nullable(),
    cost: z.number().int().nullable(),
    note: z.string().nullable(),
    status: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    serviceRequestId: z.string().nullable(),
    technicalAssessmentId: z.string().nullable(),
    approvalRequestId: z.string().nullable(),
    sourceType: z.string().nullable(),
    category: z.string().nullable(),
    action: z.string().nullable(),
    execution: z.string().nullable(),
    vendorId: z.string().nullable(),
    partId: z.string().nullable(),
    cost: z.number().int().nullable(),
    note: z.string().nullable(),
    status: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});