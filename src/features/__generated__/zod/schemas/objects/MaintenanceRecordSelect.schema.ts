import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartFindManySchema as MaintenancePartFindManySchema } from '../findManyMaintenancePart.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { ServiceRequestArgsObjectSchema as ServiceRequestArgsObjectSchema } from './ServiceRequestArgs.schema';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema';
import { VendorArgsObjectSchema as VendorArgsObjectSchema } from './VendorArgs.schema';
import { ServiceCatalogFindManySchema as ServiceCatalogFindManySchema } from '../findManyServiceCatalog.schema';
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
  parts: z.union([z.boolean(), z.lazy(() => MaintenancePartFindManySchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  serviceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestArgsObjectSchema)]).optional(),
  variant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional(),
  vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional(),
  serviceDetail: z.union([z.boolean(), z.lazy(() => ServiceCatalogFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => MaintenanceRecordCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const MaintenanceRecordSelectObjectSchema: z.ZodType<Prisma.MaintenanceRecordSelect> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordSelect>;
export const MaintenanceRecordSelectObjectZodSchema = makeSchema();
