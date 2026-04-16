import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AcquisitionOrderByWithRelationInputObjectSchema as AcquisitionOrderByWithRelationInputObjectSchema } from './AcquisitionOrderByWithRelationInput.schema';
import { CustomerOrderByWithRelationInputObjectSchema as CustomerOrderByWithRelationInputObjectSchema } from './CustomerOrderByWithRelationInput.schema';
import { OrderOrderByWithRelationInputObjectSchema as OrderOrderByWithRelationInputObjectSchema } from './OrderOrderByWithRelationInput.schema';
import { ServiceRequestOrderByWithRelationInputObjectSchema as ServiceRequestOrderByWithRelationInputObjectSchema } from './ServiceRequestOrderByWithRelationInput.schema';
import { VendorOrderByWithRelationInputObjectSchema as VendorOrderByWithRelationInputObjectSchema } from './VendorOrderByWithRelationInput.schema';
import { InvoiceItemOrderByRelationAggregateInputObjectSchema as InvoiceItemOrderByRelationAggregateInputObjectSchema } from './InvoiceItemOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  customerId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  orderId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  acquisitionId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  currency: SortOrderSchema.optional(),
  subTotal: SortOrderSchema.optional(),
  taxTotal: SortOrderSchema.optional(),
  discountTotal: SortOrderSchema.optional(),
  grandTotal: SortOrderSchema.optional(),
  issuedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dueAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  Acquisition: z.lazy(() => AcquisitionOrderByWithRelationInputObjectSchema).optional(),
  Customer: z.lazy(() => CustomerOrderByWithRelationInputObjectSchema).optional(),
  Order: z.lazy(() => OrderOrderByWithRelationInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestOrderByWithRelationInputObjectSchema).optional(),
  Vendor: z.lazy(() => VendorOrderByWithRelationInputObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const InvoiceOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.InvoiceOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceOrderByWithRelationInput>;
export const InvoiceOrderByWithRelationInputObjectZodSchema = makeSchema();
