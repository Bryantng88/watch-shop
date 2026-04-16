import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { MaintenanceEventTypeSchema } from '../enums/MaintenanceEventType.schema';
import { MaintenancePartCreateNestedManyWithoutRecordInputObjectSchema as MaintenancePartCreateNestedManyWithoutRecordInputObjectSchema } from './MaintenancePartCreateNestedManyWithoutRecordInput.schema';
import { PaymentCreateNestedOneWithoutMaintenanceRecordInputObjectSchema as PaymentCreateNestedOneWithoutMaintenanceRecordInputObjectSchema } from './PaymentCreateNestedOneWithoutMaintenanceRecordInput.schema';
import { ProductCreateNestedOneWithoutMaintenanceRecordsInputObjectSchema as ProductCreateNestedOneWithoutMaintenanceRecordsInputObjectSchema } from './ProductCreateNestedOneWithoutMaintenanceRecordsInput.schema';
import { ServiceCatalogCreateNestedOneWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogCreateNestedOneWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogCreateNestedOneWithoutMaintenanceRecordInput.schema';
import { ServiceRequestCreateNestedOneWithoutMaintenanceInputObjectSchema as ServiceRequestCreateNestedOneWithoutMaintenanceInputObjectSchema } from './ServiceRequestCreateNestedOneWithoutMaintenanceInput.schema';
import { TechnicalIssueCreateNestedOneWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueCreateNestedOneWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueCreateNestedOneWithoutMaintenanceRecordInput.schema';
import { ProductVariantCreateNestedOneWithoutMaintenanceRecordInputObjectSchema as ProductVariantCreateNestedOneWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantCreateNestedOneWithoutMaintenanceRecordInput.schema';
import { VendorCreateNestedOneWithoutServicesInputObjectSchema as VendorCreateNestedOneWithoutServicesInputObjectSchema } from './VendorCreateNestedOneWithoutServicesInput.schema'

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
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  eventType: MaintenanceEventTypeSchema.optional(),
  prevVendorId: z.string().optional().nullable(),
  prevVendorName: z.string().optional().nullable(),
  paidAmount: z.number().optional().nullable(),
  paidAt: z.coerce.date().optional().nullable(),
  technicianNameSnap: z.string().optional().nullable(),
  diagnosis: z.string().optional().nullable(),
  workSummary: z.string().optional().nullable(),
  processingMode: z.string().optional().nullable(),
  imageFileKey: z.string().optional().nullable(),
  parts: z.lazy(() => MaintenancePartCreateNestedManyWithoutRecordInputObjectSchema).optional(),
  Payment: z.lazy(() => PaymentCreateNestedOneWithoutMaintenanceRecordInputObjectSchema).optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutMaintenanceRecordsInputObjectSchema).optional(),
  ServiceCatalog: z.lazy(() => ServiceCatalogCreateNestedOneWithoutMaintenanceRecordInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedOneWithoutMaintenanceInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueCreateNestedOneWithoutMaintenanceRecordInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantCreateNestedOneWithoutMaintenanceRecordInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorCreateNestedOneWithoutServicesInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordCreateWithoutUserInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateWithoutUserInput>;
export const MaintenanceRecordCreateWithoutUserInputObjectZodSchema = makeSchema();
