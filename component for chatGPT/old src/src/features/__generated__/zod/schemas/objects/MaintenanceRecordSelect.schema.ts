import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartFindManySchema as MaintenancePartFindManySchema } from '../findManyMaintenancePart.schema';
import { PaymentArgsObjectSchema as PaymentArgsObjectSchema } from './PaymentArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { ServiceCatalogArgsObjectSchema as ServiceCatalogArgsObjectSchema } from './ServiceCatalogArgs.schema';
import { ServiceRequestArgsObjectSchema as ServiceRequestArgsObjectSchema } from './ServiceRequestArgs.schema';
import { TechnicalIssueArgsObjectSchema as TechnicalIssueArgsObjectSchema } from './TechnicalIssueArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema';
import { VendorArgsObjectSchema as VendorArgsObjectSchema } from './VendorArgs.schema';
import { MaintenanceRecordCountOutputTypeArgsObjectSchema as MaintenanceRecordCountOutputTypeArgsObjectSchema } from './MaintenanceRecordCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  billable: z.boolean().optional(),
  serviceRequestId: z.boolean().optional(),
  productId: z.boolean().optional(),
  variantId: z.boolean().optional(),
  brandSnapshot: z.boolean().optional(),
  modelSnapshot: z.boolean().optional(),
  refSnapshot: z.boolean().optional(),
  serialSnapshot: z.boolean().optional(),
  vendorId: z.boolean().optional(),
  servicedByName: z.boolean().optional(),
  vendorName: z.boolean().optional(),
  servicedAt: z.boolean().optional(),
  notes: z.boolean().optional(),
  totalCost: z.boolean().optional(),
  billed: z.boolean().optional(),
  invoiceId: z.boolean().optional(),
  revenueAmount: z.boolean().optional(),
  currency: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  eventType: z.boolean().optional(),
  prevVendorId: z.boolean().optional(),
  prevVendorName: z.boolean().optional(),
  paymentId: z.boolean().optional(),
  paidAmount: z.boolean().optional(),
  paidAt: z.boolean().optional(),
  technicianId: z.boolean().optional(),
  technicianNameSnap: z.boolean().optional(),
  diagnosis: z.boolean().optional(),
  workSummary: z.boolean().optional(),
  serviceCatalogId: z.boolean().optional(),
  processingMode: z.boolean().optional(),
  imageFileKey: z.boolean().optional(),
  technicalIssueId: z.boolean().optional(),
  parts: z.union([z.boolean(), z.lazy(() => MaintenancePartFindManySchema)]).optional(),
  Payment: z.union([z.boolean(), z.lazy(() => PaymentArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  ServiceCatalog: z.union([z.boolean(), z.lazy(() => ServiceCatalogArgsObjectSchema)]).optional(),
  serviceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestArgsObjectSchema)]).optional(),
  TechnicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueArgsObjectSchema)]).optional(),
  User: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  variant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional(),
  vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => MaintenanceRecordCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const MaintenanceRecordSelectObjectSchema: z.ZodType<Prisma.MaintenanceRecordSelect> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordSelect>;
export const MaintenanceRecordSelectObjectZodSchema = makeSchema();
