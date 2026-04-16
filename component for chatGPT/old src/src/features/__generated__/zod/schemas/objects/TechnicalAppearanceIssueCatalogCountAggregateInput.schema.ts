import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  area: z.literal(true).optional(),
  label: z.literal(true).optional(),
  deductionScore: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  note: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const TechnicalAppearanceIssueCatalogCountAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalAppearanceIssueCatalogCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAppearanceIssueCatalogCountAggregateInputType>;
export const TechnicalAppearanceIssueCatalogCountAggregateInputObjectZodSchema = makeSchema();
