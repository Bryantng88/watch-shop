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
  maintenanceRecordId: z.literal(true).optional(),
  detail: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const ServiceCatalogCountAggregateInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCountAggregateInputType>;
export const ServiceCatalogCountAggregateInputObjectZodSchema = makeSchema();
