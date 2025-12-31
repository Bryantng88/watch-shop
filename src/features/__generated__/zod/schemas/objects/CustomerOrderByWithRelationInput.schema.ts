import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AcquisitionOrderByRelationAggregateInputObjectSchema as AcquisitionOrderByRelationAggregateInputObjectSchema } from './AcquisitionOrderByRelationAggregateInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { InvoiceOrderByRelationAggregateInputObjectSchema as InvoiceOrderByRelationAggregateInputObjectSchema } from './InvoiceOrderByRelationAggregateInput.schema';
import { OrderOrderByRelationAggregateInputObjectSchema as OrderOrderByRelationAggregateInputObjectSchema } from './OrderOrderByRelationAggregateInput.schema';
import { ServiceRequestOrderByRelationAggregateInputObjectSchema as ServiceRequestOrderByRelationAggregateInputObjectSchema } from './ServiceRequestOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  email: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  phone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  ward: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  city: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  address: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  Acquisition: z.lazy(() => AcquisitionOrderByRelationAggregateInputObjectSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  Invoice: z.lazy(() => InvoiceOrderByRelationAggregateInputObjectSchema).optional(),
  orders: z.lazy(() => OrderOrderByRelationAggregateInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const CustomerOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CustomerOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerOrderByWithRelationInput>;
export const CustomerOrderByWithRelationInputObjectZodSchema = makeSchema();
