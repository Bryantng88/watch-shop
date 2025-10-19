import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  defaultPrice: z.literal(true).optional(),
  durationMin: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  maintenanceRecordId: z.literal(true).optional()
}).strict();
export const ServiceCatalogMaxAggregateInputObjectSchema: z.ZodType<Prisma.ServiceCatalogMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogMaxAggregateInputType>;
export const ServiceCatalogMaxAggregateInputObjectZodSchema = makeSchema();
