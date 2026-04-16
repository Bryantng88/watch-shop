import * as z from 'zod';
export const technicalActionCatalogGroupByResultSchema = z.array(z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  appliesTo: z.string(),
  groupKey: z.string(),
  requiresPart: z.boolean(),
  defaultExecutionMode: z.string(),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
  note: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    code: z.number(),
    name: z.number(),
    appliesTo: z.number(),
    groupKey: z.number(),
    requiresPart: z.number(),
    defaultExecutionMode: z.number(),
    sortOrder: z.number(),
    isActive: z.number(),
    note: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _sum: z.object({
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    name: z.string().nullable(),
    appliesTo: z.string().nullable(),
    groupKey: z.string().nullable(),
    defaultExecutionMode: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    name: z.string().nullable(),
    appliesTo: z.string().nullable(),
    groupKey: z.string().nullable(),
    defaultExecutionMode: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));