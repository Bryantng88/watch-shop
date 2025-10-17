import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  defaultPrice: z.number().optional().nullable(),
  durationMin: z.number().int().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ServiceCatalogCreateManyMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ServiceCatalogCreateManyMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCreateManyMaintenanceRecordInput>;
export const ServiceCatalogCreateManyMaintenanceRecordInputObjectZodSchema = makeSchema();
