import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  defaultCost: z.literal(true).optional(),
  sortOrder: z.literal(true).optional()
}).strict();
export const MechanicalPartCatalogAvgAggregateInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogAvgAggregateInputType>;
export const MechanicalPartCatalogAvgAggregateInputObjectZodSchema = makeSchema();
