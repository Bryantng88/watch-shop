import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  name: z.literal(true).optional(),
  appliesTo: z.literal(true).optional(),
  groupKey: z.literal(true).optional(),
  requiresPart: z.literal(true).optional(),
  defaultExecutionMode: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  note: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const TechnicalActionCatalogMinAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalActionCatalogMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalActionCatalogMinAggregateInputType>;
export const TechnicalActionCatalogMinAggregateInputObjectZodSchema = makeSchema();
