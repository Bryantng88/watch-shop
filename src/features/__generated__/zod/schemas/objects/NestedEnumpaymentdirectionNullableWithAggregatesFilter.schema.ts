import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { paymentdirectionSchema } from '../enums/paymentdirection.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumpaymentdirectionNullableFilterObjectSchema as NestedEnumpaymentdirectionNullableFilterObjectSchema } from './NestedEnumpaymentdirectionNullableFilter.schema'

const nestedenumpaymentdirectionnullablewithaggregatesfilterSchema = z.object({
  equals: paymentdirectionSchema.optional().nullable(),
  in: paymentdirectionSchema.array().optional().nullable(),
  notIn: paymentdirectionSchema.array().optional().nullable(),
  not: z.union([paymentdirectionSchema, z.lazy(() => NestedEnumpaymentdirectionNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumpaymentdirectionNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumpaymentdirectionNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumpaymentdirectionNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumpaymentdirectionNullableWithAggregatesFilter> = nestedenumpaymentdirectionnullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumpaymentdirectionNullableWithAggregatesFilter>;
export const NestedEnumpaymentdirectionNullableWithAggregatesFilterObjectZodSchema = nestedenumpaymentdirectionnullablewithaggregatesfilterSchema;
