import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordArgsObjectSchema as MaintenanceRecordArgsObjectSchema } from './MaintenanceRecordArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  defaultPrice: z.boolean().optional(),
  durationMin: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  maintenanceRecordId: z.boolean().optional(),
  MaintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordArgsObjectSchema)]).optional()
}).strict();
export const ServiceCatalogSelectObjectSchema: z.ZodType<Prisma.ServiceCatalogSelect> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogSelect>;
export const ServiceCatalogSelectObjectZodSchema = makeSchema();
