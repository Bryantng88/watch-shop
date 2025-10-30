import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AcquisitionItemOrderByRelationAggregateInputObjectSchema as AcquisitionItemOrderByRelationAggregateInputObjectSchema } from './AcquisitionItemOrderByRelationAggregateInput.schema';
import { InvoiceItemOrderByRelationAggregateInputObjectSchema as InvoiceItemOrderByRelationAggregateInputObjectSchema } from './InvoiceItemOrderByRelationAggregateInput.schema';
import { MaintenancePartOrderByRelationAggregateInputObjectSchema as MaintenancePartOrderByRelationAggregateInputObjectSchema } from './MaintenancePartOrderByRelationAggregateInput.schema';
import { MaintenanceRecordOrderByRelationAggregateInputObjectSchema as MaintenanceRecordOrderByRelationAggregateInputObjectSchema } from './MaintenanceRecordOrderByRelationAggregateInput.schema';
import { PartVariantSpecOrderByWithRelationInputObjectSchema as PartVariantSpecOrderByWithRelationInputObjectSchema } from './PartVariantSpecOrderByWithRelationInput.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema';
import { ServiceRequestOrderByRelationAggregateInputObjectSchema as ServiceRequestOrderByRelationAggregateInputObjectSchema } from './ServiceRequestOrderByRelationAggregateInput.schema';
import { StrapVariantSpecOrderByWithRelationInputObjectSchema as StrapVariantSpecOrderByWithRelationInputObjectSchema } from './StrapVariantSpecOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  sku: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  name: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  price: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  stockQty: SortOrderSchema.optional(),
  isStockManaged: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  maxQtyPerOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  availabilityStatuts: SortOrderSchema.optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemOrderByRelationAggregateInputObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemOrderByRelationAggregateInputObjectSchema).optional(),
  MaintenancePart: z.lazy(() => MaintenancePartOrderByRelationAggregateInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordOrderByRelationAggregateInputObjectSchema).optional(),
  partSpec: z.lazy(() => PartVariantSpecOrderByWithRelationInputObjectSchema).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestOrderByRelationAggregateInputObjectSchema).optional(),
  strapSpec: z.lazy(() => StrapVariantSpecOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const ProductVariantOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ProductVariantOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantOrderByWithRelationInput>;
export const ProductVariantOrderByWithRelationInputObjectZodSchema = makeSchema();
