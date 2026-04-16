import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  name: z.literal(true).optional(),
  category: z.literal(true).optional(),
  unit: z.literal(true).optional(),
  defaultCost: z.literal(true).optional(),
  note: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const SupplyCatalogMinAggregateInputObjectSchema: z.ZodType<Prisma.SupplyCatalogMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogMinAggregateInputType>;
export const SupplyCatalogMinAggregateInputObjectZodSchema = makeSchema();
