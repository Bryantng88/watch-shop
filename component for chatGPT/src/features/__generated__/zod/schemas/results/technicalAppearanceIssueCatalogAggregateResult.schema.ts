import * as z from 'zod';
export const technicalAppearanceIssueCatalogAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    code: z.number(),
    area: z.number(),
    label: z.number(),
    deductionScore: z.number(),
    sortOrder: z.number(),
    isActive: z.number(),
    note: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _sum: z.object({
    deductionScore: z.number().nullable(),
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    deductionScore: z.number().nullable(),
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    area: z.string().nullable(),
    label: z.string().nullable(),
    deductionScore: z.number().int().nullable(),
    sortOrder: z.number().int().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    area: z.string().nullable(),
    label: z.string().nullable(),
    deductionScore: z.number().int().nullable(),
    sortOrder: z.number().int().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});