import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  defaultPrice: z.literal(true).optional(),
  durationMin: z.literal(true).optional()
}).strict();
export const ServiceCatalogSumAggregateInputObjectSchema: z.ZodType<Prisma.ServiceCatalogSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogSumAggregateInputType>;
export const ServiceCatalogSumAggregateInputObjectZodSchema = makeSchema();
