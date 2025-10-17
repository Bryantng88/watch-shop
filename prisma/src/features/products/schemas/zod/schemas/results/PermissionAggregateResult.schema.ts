import * as z from 'zod';
export const PermissionAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    code: z.number(),
    description: z.number(),
    roles: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    description: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    description: z.string().nullable()
  }).nullable().optional()});