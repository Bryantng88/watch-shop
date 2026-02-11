import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { MaintenancePartUncheckedCreateNestedManyWithoutRecordInputObjectSchema as MaintenancePartUncheckedCreateNestedManyWithoutRecordInputObjectSchema } from './MaintenancePartUncheckedCreateNestedManyWithoutRecordInput.schema';
import { ServiceCatalogUncheckedCreateNestedManyWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogUncheckedCreateNestedManyWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogUncheckedCreateNestedManyWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: ServiceTypeSchema.optional(),
  billable: z.boolean().optional(),
  serviceRequestId: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  variantId: z.string().optional().nullable(),
  brandSnapshot: z.string().optional().nullable(),
  modelSnapshot: z.string().optional().nullable(),
  refSnapshot: z.string().optional().nullable(),
  serialSnapshot: z.string().optional().nullable(),
  servicedByName: z.string().optional().nullable(),
  vendorName: z.string().optional().nullable(),
  servicedAt: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
  totalCost: z.number().optional().nullable(),
  billed: z.boolean().optional(),
  invoiceId: z.string().optional().nullable(),
  revenueAmount: z.number().optional().nullable(),
  currency: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  parts: z.lazy(() => MaintenancePartUncheckedCreateNestedManyWithoutRecordInputObjectSchema).optional(),
  serviceDetail: z.lazy(() => ServiceCatalogUncheckedCreateNestedManyWithoutMaintenanceRecordInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordUncheckedCreateWithoutVendorInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUncheckedCreateWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUncheckedCreateWithoutVendorInput>;
export const MaintenanceRecordUncheckedCreateWithoutVendorInputObjectZodSchema = makeSchema();
