import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { VendorOrderByRelationAggregateInputObjectSchema as VendorOrderByRelationAggregateInputObjectSchema } from './VendorOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  created_at: SortOrderSchema.optional(),
  bankName: SortOrderSchema.optional(),
  Vendor: z.lazy(() => VendorOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const BankOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.BankOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.BankOrderByWithRelationInput>;
export const BankOrderByWithRelationInputObjectZodSchema = makeSchema();
