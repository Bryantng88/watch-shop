import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  defaultCost: z.literal(true).optional(),
  sortOrder: z.literal(true).optional()
}).strict();
export const MechanicalPartCatalogSumAggregateInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogSumAggregateInputType>;
export const MechanicalPartCatalogSumAggregateInputObjectZodSchema = makeSchema();
