import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  defaultPrice: z.literal(true).optional(),
  durationMin: z.literal(true).optional()
}).strict();
export const ServiceCatalogAvgAggregateInputObjectSchema: z.ZodType<Prisma.ServiceCatalogAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogAvgAggregateInputType>;
export const ServiceCatalogAvgAggregateInputObjectZodSchema = makeSchema();
