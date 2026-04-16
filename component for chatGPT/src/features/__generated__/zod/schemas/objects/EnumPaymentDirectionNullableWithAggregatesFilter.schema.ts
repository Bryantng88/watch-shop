import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentDirectionSchema } from '../enums/PaymentDirection.schema';
import { NestedEnumPaymentDirectionNullableWithAggregatesFilterObjectSchema as NestedEnumPaymentDirectionNullableWithAggregatesFilterObjectSchema } from './NestedEnumPaymentDirectionNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumPaymentDirectionNullableFilterObjectSchema as NestedEnumPaymentDirectionNullableFilterObjectSchema } from './NestedEnumPaymentDirectionNullableFilter.schema'

const makeSchema = () => z.object({
  equals: PaymentDirectionSchema.optional().nullable(),
  in: PaymentDirectionSchema.array().optional().nullable(),
  notIn: PaymentDirectionSchema.array().optional().nullable(),
  not: z.union([PaymentDirectionSchema, z.lazy(() => NestedEnumPaymentDirectionNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentDirectionNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentDirectionNullableFilterObjectSchema).optional()
}).strict();
export const EnumPaymentDirectionNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumPaymentDirectionNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPaymentDirectionNullableWithAggregatesFilter>;
export const EnumPaymentDirectionNullableWithAggregatesFilterObjectZodSchema = makeSchema();
