import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { MaintenancePartCreateNestedManyWithoutRecordInputObjectSchema as MaintenancePartCreateNestedManyWithoutRecordInputObjectSchema } from './MaintenancePartCreateNestedManyWithoutRecordInput.schema';
import { ProductCreateNestedOneWithoutMaintenanceRecordsInputObjectSchema as ProductCreateNestedOneWithoutMaintenanceRecordsInputObjectSchema } from './ProductCreateNestedOneWithoutMaintenanceRecordsInput.schema';
import { ServiceRequestCreateNestedOneWithoutMaintenanceInputObjectSchema as ServiceRequestCreateNestedOneWithoutMaintenanceInputObjectSchema } from './ServiceRequestCreateNestedOneWithoutMaintenanceInput.schema';
import { ProductVariantCreateNestedOneWithoutMaintenanceRecordInputObjectSchema as ProductVariantCreateNestedOneWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantCreateNestedOneWithoutMaintenanceRecordInput.schema';
import { VendorCreateNestedOneWithoutServicesInputObjectSchema as VendorCreateNestedOneWithoutServicesInputObjectSchema } from './VendorCreateNestedOneWithoutServicesInput.schema';
import { ServiceCatalogCreateNestedManyWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogCreateNestedManyWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogCreateNestedManyWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: ServiceTypeSchema.optional(),
  billable: z.boolean().optional(),
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
  parts: z.lazy(() => MaintenancePartCreateNestedManyWithoutRecordInputObjectSchema),
  product: z.lazy(() => ProductCreateNestedOneWithoutMaintenanceRecordsInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedOneWithoutMaintenanceInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantCreateNestedOneWithoutMaintenanceRecordInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorCreateNestedOneWithoutServicesInputObjectSchema).optional(),
  serviceDetail: z.lazy(() => ServiceCatalogCreateNestedManyWithoutMaintenanceRecordInputObjectSchema)
}).strict();
export const MaintenanceRecordCreateInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateInput>;
export const MaintenanceRecordCreateInputObjectZodSchema = makeSchema();
