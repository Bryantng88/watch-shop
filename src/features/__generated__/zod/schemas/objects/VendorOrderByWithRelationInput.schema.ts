import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AcquisitionOrderByRelationAggregateInputObjectSchema as AcquisitionOrderByRelationAggregateInputObjectSchema } from './AcquisitionOrderByRelationAggregateInput.schema';
import { InvoiceOrderByRelationAggregateInputObjectSchema as InvoiceOrderByRelationAggregateInputObjectSchema } from './InvoiceOrderByRelationAggregateInput.schema';
import { MaintenanceRecordOrderByRelationAggregateInputObjectSchema as MaintenanceRecordOrderByRelationAggregateInputObjectSchema } from './MaintenanceRecordOrderByRelationAggregateInput.schema';
import { ProductOrderByRelationAggregateInputObjectSchema as ProductOrderByRelationAggregateInputObjectSchema } from './ProductOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  isAuthorized: SortOrderSchema.optional(),
  email: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  phone: SortOrderSchema.optional(),
  address: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  acquisitions: z.lazy(() => AcquisitionOrderByRelationAggregateInputObjectSchema).optional(),
  invoice: z.lazy(() => InvoiceOrderByRelationAggregateInputObjectSchema).optional(),
  services: z.lazy(() => MaintenanceRecordOrderByRelationAggregateInputObjectSchema).optional(),
  Product: z.lazy(() => ProductOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const VendorOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.VendorOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorOrderByWithRelationInput>;
export const VendorOrderByWithRelationInputObjectZodSchema = makeSchema();
