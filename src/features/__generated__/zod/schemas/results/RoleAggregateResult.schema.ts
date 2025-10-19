import * as z from 'zod';
export const RoleAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    name: z.number(),
    description: z.number(),
    permissions: z.number(),
    users: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable()
  }).nullable().optional()});