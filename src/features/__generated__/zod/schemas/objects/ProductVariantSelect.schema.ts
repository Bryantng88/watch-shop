import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemFindManySchema as AcquisitionItemFindManySchema } from '../findManyAcquisitionItem.schema';
import { InvoiceItemFindManySchema as InvoiceItemFindManySchema } from '../findManyInvoiceItem.schema';
import { MaintenancePartFindManySchema as MaintenancePartFindManySchema } from '../findManyMaintenancePart.schema';
import { MaintenanceRecordFindManySchema as MaintenanceRecordFindManySchema } from '../findManyMaintenanceRecord.schema';
import { PartVariantSpecArgsObjectSchema as PartVariantSpecArgsObjectSchema } from './PartVariantSpecArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { StrapVariantSpecArgsObjectSchema as StrapVariantSpecArgsObjectSchema } from './StrapVariantSpecArgs.schema';
import { ProductVariantCountOutputTypeArgsObjectSchema as ProductVariantCountOutputTypeArgsObjectSchema } from './ProductVariantCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  productId: z.boolean().optional(),
  sku: z.boolean().optional(),
  name: z.boolean().optional(),
  price: z.boolean().optional(),
  stockQty: z.boolean().optional(),
  isStockManaged: z.boolean().optional(),
  maxQtyPerOrder: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  availabilityStatuts: z.boolean().optional(),
  AcquisitionItem: z.union([z.boolean(), z.lazy(() => AcquisitionItemFindManySchema)]).optional(),
  InvoiceItem: z.union([z.boolean(), z.lazy(() => InvoiceItemFindManySchema)]).optional(),
  MaintenancePart: z.union([z.boolean(), z.lazy(() => MaintenancePartFindManySchema)]).optional(),
  MaintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  partSpec: z.union([z.boolean(), z.lazy(() => PartVariantSpecArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  ServiceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  strapSpec: z.union([z.boolean(), z.lazy(() => StrapVariantSpecArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProductVariantCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ProductVariantSelectObjectSchema: z.ZodType<Prisma.ProductVariantSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantSelect>;
export const ProductVariantSelectObjectZodSchema = makeSchema();
