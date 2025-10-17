import * as z from 'zod';
export const PermissionGroupByResultSchema = z.array(z.object({
  id: z.string(),
  code: z.string(),
  description: z.string(),
  _count: z.object({
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
  }).nullable().optional()
}));