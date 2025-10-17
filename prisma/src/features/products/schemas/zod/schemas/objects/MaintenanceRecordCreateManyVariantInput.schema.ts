import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceTypeSchema } from '../enums/ServiceType.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: ServiceTypeSchema.optional(),
  billable: z.boolean().optional(),
  serviceRequestId: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  brandSnapshot: z.string().optional().nullable(),
  modelSnapshot: z.string().optional().nullable(),
  refSnapshot: z.string().optional().nullable(),
  serialSnapshot: z.string().optional().nullable(),
  vendorId: z.string().optional().nullable(),
  servicedByName: z.string().optional().nullable(),
  vendorName: z.string().optional().nullable(),
  servicedAt: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
  totalCost: z.number().optional().nullable(),
  billed: z.boolean().optional(),
  invoiceId: z.string().optional().nullable(),
  revenueAmount: z.number().optional().nullable(),
  currency: z.string().optional()
}).strict();
export const MaintenanceRecordCreateManyVariantInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateManyVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateManyVariantInput>;
export const MaintenanceRecordCreateManyVariantInputObjectZodSchema = makeSchema();
