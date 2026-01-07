import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  method: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  paidAt: SortOrderSchema.optional(),
  reference: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  direction: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  order_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  service_request_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendor_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  acquisition_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  purpose: SortOrderSchema.optional()
}).strict();
export const PaymentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.PaymentOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentOrderByWithRelationInput>;
export const PaymentOrderByWithRelationInputObjectZodSchema = makeSchema();
