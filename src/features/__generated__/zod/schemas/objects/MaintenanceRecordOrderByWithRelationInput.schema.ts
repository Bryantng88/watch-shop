import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MaintenancePartOrderByRelationAggregateInputObjectSchema as MaintenancePartOrderByRelationAggregateInputObjectSchema } from './MaintenancePartOrderByRelationAggregateInput.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema';
import { ServiceRequestOrderByWithRelationInputObjectSchema as ServiceRequestOrderByWithRelationInputObjectSchema } from './ServiceRequestOrderByWithRelationInput.schema';
import { ProductVariantOrderByWithRelationInputObjectSchema as ProductVariantOrderByWithRelationInputObjectSchema } from './ProductVariantOrderByWithRelationInput.schema';
import { VendorOrderByWithRelationInputObjectSchema as VendorOrderByWithRelationInputObjectSchema } from './VendorOrderByWithRelationInput.schema';
import { ServiceCatalogOrderByRelationAggregateInputObjectSchema as ServiceCatalogOrderByRelationAggregateInputObjectSchema } from './ServiceCatalogOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  billable: SortOrderSchema.optional(),
  serviceRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  productId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  variantId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  brandSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  modelSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  refSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serialSnapshot: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  servicedByName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  servicedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  totalCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  billed: SortOrderSchema.optional(),
  invoiceId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  revenueAmount: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  currency: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  parts: z.lazy(() => MaintenancePartOrderByRelationAggregateInputObjectSchema).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestOrderByWithRelationInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantOrderByWithRelationInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorOrderByWithRelationInputObjectSchema).optional(),
  serviceDetail: z.lazy(() => ServiceCatalogOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordOrderByWithRelationInput>;
export const MaintenanceRecordOrderByWithRelationInputObjectZodSchema = makeSchema();
