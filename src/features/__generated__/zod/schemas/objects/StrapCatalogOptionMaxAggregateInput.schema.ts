import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  kind: z.literal(true).optional(),
  code: z.literal(true).optional(),
  name: z.literal(true).optional(),
  colorHex: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const StrapCatalogOptionMaxAggregateInputObjectSchema: z.ZodType<Prisma.StrapCatalogOptionMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.StrapCatalogOptionMaxAggregateInputType>;
export const StrapCatalogOptionMaxAggregateInputObjectZodSchema = makeSchema();
