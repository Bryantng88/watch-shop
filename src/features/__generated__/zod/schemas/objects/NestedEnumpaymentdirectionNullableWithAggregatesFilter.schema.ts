import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentDirectionSchema } from '../enums/PaymentDirection.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumPaymentDirectionNullableFilterObjectSchema as NestedEnumPaymentDirectionNullableFilterObjectSchema } from './NestedEnumPaymentDirectionNullableFilter.schema'

const nestedenumpaymentdirectionnullablewithaggregatesfilterSchema = z.object({
  equals: PaymentDirectionSchema.optional().nullable(),
  in: PaymentDirectionSchema.array().optional().nullable(),
  notIn: PaymentDirectionSchema.array().optional().nullable(),
  not: z.union([PaymentDirectionSchema, z.lazy(() => NestedEnumPaymentDirectionNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentDirectionNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentDirectionNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumPaymentDirectionNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumPaymentDirectionNullableWithAggregatesFilter> = nestedenumpaymentdirectionnullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPaymentDirectionNullableWithAggregatesFilter>;
export const NestedEnumPaymentDirectionNullableWithAggregatesFilterObjectZodSchema = nestedenumpaymentdirectionnullablewithaggregatesfilterSchema;
