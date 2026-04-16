import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderVerificationStatusSchema } from '../enums/OrderVerificationStatus.schema';
import { NestedEnumOrderVerificationStatusWithAggregatesFilterObjectSchema as NestedEnumOrderVerificationStatusWithAggregatesFilterObjectSchema } from './NestedEnumOrderVerificationStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumOrderVerificationStatusFilterObjectSchema as NestedEnumOrderVerificationStatusFilterObjectSchema } from './NestedEnumOrderVerificationStatusFilter.schema'

const makeSchema = () => z.object({
  equals: OrderVerificationStatusSchema.optional(),
  in: OrderVerificationStatusSchema.array().optional(),
  notIn: OrderVerificationStatusSchema.array().optional(),
  not: z.union([OrderVerificationStatusSchema, z.lazy(() => NestedEnumOrderVerificationStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderVerificationStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderVerificationStatusFilterObjectSchema).optional()
}).strict();
export const EnumOrderVerificationStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumOrderVerificationStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumOrderVerificationStatusWithAggregatesFilter>;
export const EnumOrderVerificationStatusWithAggregatesFilterObjectZodSchema = makeSchema();
