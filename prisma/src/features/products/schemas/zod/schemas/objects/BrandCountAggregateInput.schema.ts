import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  slug: z.literal(true).optional(),
  country: z.literal(true).optional(),
  foundedYear: z.literal(true).optional(),
  website: z.literal(true).optional(),
  logoUrl: z.literal(true).optional(),
  isAuthorized: z.literal(true).optional(),
  status: z.literal(true).optional(),
  description: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const BrandCountAggregateInputObjectSchema: z.ZodType<Prisma.BrandCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BrandCountAggregateInputType>;
export const BrandCountAggregateInputObjectZodSchema = makeSchema();
