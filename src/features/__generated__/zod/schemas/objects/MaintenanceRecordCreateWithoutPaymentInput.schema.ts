import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { MaintenanceEventTypeSchema } from '../enums/MaintenanceEventType.schema';
import { MaintenancePartCreateNestedManyWithoutMaintenanceRecordInputObjectSchema as MaintenancePartCreateNestedManyWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartCreateNestedManyWithoutMaintenanceRecordInput.schema';
import { ProductCreateNestedOneWithoutMaintenanceRecordInputObjectSchema as ProductCreateNestedOneWithoutMaintenanceRecordInputObjectSchema } from './ProductCreateNestedOneWithoutMaintenanceRecordInput.schema';
import { ServiceCatalogCreateNestedOneWithoutMaintenanceRecordInputObjectSchema as ServiceCatalogCreateNestedOneWithoutMaintenanceRecordInputObjectSchema } from './ServiceCatalogCreateNestedOneWithoutMaintenanceRecordInput.schema';
import { ServiceRequestCreateNestedOneWithoutMaintenanceRecordInputObjectSchema as ServiceRequestCreateNestedOneWithoutMaintenanceRecordInputObjectSchema } from './ServiceRequestCreateNestedOneWithoutMaintenanceRecordInput.schema';
import { TechnicalIssueCreateNestedOneWithoutMaintenanceRecordInputObjectSchema as TechnicalIssueCreateNestedOneWithoutMaintenanceRecordInputObjectSchema } from './TechnicalIssueCreateNestedOneWithoutMaintenanceRecordInput.schema';
import { UserCreateNestedOneWithoutMaintenanceRecordInputObjectSchema as UserCreateNestedOneWithoutMaintenanceRecordInputObjectSchema } from './UserCreateNestedOneWithoutMaintenanceRecordInput.schema';
import { ProductVariantCreateNestedOneWithoutMaintenanceRecordInputObjectSchema as ProductVariantCreateNestedOneWithoutMaintenanceRecordInputObjectSchema } from './ProductVariantCreateNestedOneWithoutMaintenanceRecordInput.schema';
import { VendorCreateNestedOneWithoutMaintenanceRecordInputObjectSchema as VendorCreateNestedOneWithoutMaintenanceRecordInputObjectSchema } from './VendorCreateNestedOneWithoutMaintenanceRecordInput.schema'

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
  MaintenancePart: z.lazy(() => MaintenancePartCreateNestedManyWithoutMaintenanceRecordInputObjectSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedOneWithoutMaintenanceRecordInputObjectSchema).optional(),
  serviceCatalog: z.lazy(() => ServiceCatalogCreateNestedOneWithoutMaintenanceRecordInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedOneWithoutMaintenanceRecordInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueCreateNestedOneWithoutMaintenanceRecordInputObjectSchema).optional(),
  User: z.lazy(() => UserCreateNestedOneWithoutMaintenanceRecordInputObjectSchema).optional(),
  ProductVariant: z.lazy(() => ProductVariantCreateNestedOneWithoutMaintenanceRecordInputObjectSchema).optional(),
  Vendor: z.lazy(() => VendorCreateNestedOneWithoutMaintenanceRecordInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordCreateWithoutPaymentInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateWithoutPaymentInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateWithoutPaymentInput>;
export const MaintenanceRecordCreateWithoutPaymentInputObjectZodSchema = makeSchema();
