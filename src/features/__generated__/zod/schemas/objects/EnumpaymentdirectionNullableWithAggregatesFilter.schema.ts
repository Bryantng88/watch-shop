import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { paymentdirectionSchema } from '../enums/paymentdirection.schema';
import { NestedEnumpaymentdirectionNullableWithAggregatesFilterObjectSchema as NestedEnumpaymentdirectionNullableWithAggregatesFilterObjectSchema } from './NestedEnumpaymentdirectionNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumpaymentdirectionNullableFilterObjectSchema as NestedEnumpaymentdirectionNullableFilterObjectSchema } from './NestedEnumpaymentdirectionNullableFilter.schema'

const makeSchema = () => z.object({
  equals: paymentdirectionSchema.optional().nullable(),
  in: paymentdirectionSchema.array().optional().nullable(),
  notIn: paymentdirectionSchema.array().optional().nullable(),
  not: z.union([paymentdirectionSchema, z.lazy(() => NestedEnumpaymentdirectionNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumpaymentdirectionNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumpaymentdirectionNullableFilterObjectSchema).optional()
}).strict();
export const EnumpaymentdirectionNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumpaymentdirectionNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumpaymentdirectionNullableWithAggregatesFilter>;
export const EnumpaymentdirectionNullableWithAggregatesFilterObjectZodSchema = makeSchema();
