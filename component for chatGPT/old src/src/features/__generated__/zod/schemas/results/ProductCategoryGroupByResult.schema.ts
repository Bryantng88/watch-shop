import * as z from 'zod';
export const ProductCategoryGroupByResultSchema = z.array(z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    code: z.number(),
    name: z.number(),
    scope: z.number(),
    isActive: z.number(),
    sortOrder: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    Product: z.number()
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
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    name: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));