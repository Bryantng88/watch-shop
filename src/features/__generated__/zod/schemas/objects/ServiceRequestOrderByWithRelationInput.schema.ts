import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { InvoiceOrderByRelationAggregateInputObjectSchema as InvoiceOrderByRelationAggregateInputObjectSchema } from './InvoiceOrderByRelationAggregateInput.schema';
import { MaintenanceRecordOrderByRelationAggregateInputObjectSchema as MaintenanceRecordOrderByRelationAggregateInputObjectSchema } from './MaintenanceRecordOrderByRelationAggregateInput.schema';
import { CustomerOrderByWithRelationInputObjectSchema as CustomerOrderByWithRelationInputObjectSchema } from './CustomerOrderByWithRelationInput.schema';
import { OrderItemOrderByWithRelationInputObjectSchema as OrderItemOrderByWithRelationInputObjectSchema } from './OrderItemOrderByWithRelationInput.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema';
import { ProductVariantOrderByWithRelationInputObjectSchema as ProductVariantOrderByWithRelationInputObjectSchema } from './ProductVariantOrderByWithRelationInput.schema';
import { ServiceCatalogOrderByWithRelationInputObjectSchema as ServiceCatalogOrderByWithRelationInputObjectSchema } from './ServiceCatalogOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  billable: SortOrderSchema.optional(),
  orderItemId: SortOrderSchema.optional(),
  customerId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  productId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  variantId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  brandSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  modelSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  refSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serialSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  appointmentAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  warrantyUntil: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  warrantyPolicy: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  servicecatalogid: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  Invoice: z.lazy(() => InvoiceOrderByRelationAggregateInputObjectSchema).optional(),
  maintenance: z.lazy(() => MaintenanceRecordOrderByRelationAggregateInputObjectSchema).optional(),
  customer: z.lazy(() => CustomerOrderByWithRelationInputObjectSchema).optional(),
  orderItem: z.lazy(() => OrderItemOrderByWithRelationInputObjectSchema).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantOrderByWithRelationInputObjectSchema).optional(),
  ServiceCatalog: z.lazy(() => ServiceCatalogOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const ServiceRequestOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ServiceRequestOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestOrderByWithRelationInput>;
export const ServiceRequestOrderByWithRelationInputObjectZodSchema = makeSchema();
