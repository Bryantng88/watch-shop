import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  name: z.literal(true).optional(),
  group: z.literal(true).optional(),
  defaultCost: z.literal(true).optional(),
  note: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const MechanicalPartCatalogMinAggregateInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogMinAggregateInputType>;
export const MechanicalPartCatalogMinAggregateInputObjectZodSchema = makeSchema();
