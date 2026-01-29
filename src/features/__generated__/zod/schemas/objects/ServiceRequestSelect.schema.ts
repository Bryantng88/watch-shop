import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceFindManySchema as InvoiceFindManySchema } from '../findManyInvoice.schema';
import { MaintenanceRecordFindManySchema as MaintenanceRecordFindManySchema } from '../findManyMaintenanceRecord.schema';
import { CustomerArgsObjectSchema as CustomerArgsObjectSchema } from './CustomerArgs.schema';
import { OrderItemArgsObjectSchema as OrderItemArgsObjectSchema } from './OrderItemArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema';
import { ServiceCatalogArgsObjectSchema as ServiceCatalogArgsObjectSchema } from './ServiceCatalogArgs.schema';
import { ServiceRequestCountOutputTypeArgsObjectSchema as ServiceRequestCountOutputTypeArgsObjectSchema } from './ServiceRequestCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  type: z.boolean().optional(),
  billable: z.boolean().optional(),
  orderItemId: z.boolean().optional(),
  customerId: z.boolean().optional(),
  productId: z.boolean().optional(),
  variantId: z.boolean().optional(),
  brandSnapshot: z.boolean().optional(),
  modelSnapshot: z.boolean().optional(),
  refSnapshot: z.boolean().optional(),
  serialSnapshot: z.boolean().optional(),
  appointmentAt: z.boolean().optional(),
  status: z.boolean().optional(),
  notes: z.boolean().optional(),
  warrantyUntil: z.boolean().optional(),
  warrantyPolicy: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  servicecatalogid: z.boolean().optional(),
  refNo: z.boolean().optional(),
  Invoice: z.union([z.boolean(), z.lazy(() => InvoiceFindManySchema)]).optional(),
  maintenance: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  customer: z.union([z.boolean(), z.lazy(() => CustomerArgsObjectSchema)]).optional(),
  orderItem: z.union([z.boolean(), z.lazy(() => OrderItemArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  variant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional(),
  ServiceCatalog: z.union([z.boolean(), z.lazy(() => ServiceCatalogArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ServiceRequestCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ServiceRequestSelectObjectSchema: z.ZodType<Prisma.ServiceRequestSelect> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestSelect>;
export const ServiceRequestSelectObjectZodSchema = makeSchema();
