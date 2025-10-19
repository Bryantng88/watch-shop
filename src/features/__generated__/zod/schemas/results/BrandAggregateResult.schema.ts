import * as z from 'zod';
export const BrandAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    name: z.number(),
    slug: z.number(),
    country: z.number(),
    foundedYear: z.number(),
    website: z.number(),
    logoUrl: z.number(),
    isAuthorized: z.number(),
    status: z.number(),
    description: z.number(),
    sortOrder: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    products: z.number()
  }).optional(),
  _sum: z.object({
    foundedYear: z.number().nullable(),
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    foundedYear: z.number().nullable(),
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    slug: z.string().nullable(),
    country: z.string().nullable(),
    foundedYear: z.number().int().nullable(),
    website: z.string().nullable(),
    logoUrl: z.string().nullable(),
    description: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    slug: z.string().nullable(),
    country: z.string().nullable(),
    foundedYear: z.number().int().nullable(),
    website: z.string().nullable(),
    logoUrl: z.string().nullable(),
    description: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});