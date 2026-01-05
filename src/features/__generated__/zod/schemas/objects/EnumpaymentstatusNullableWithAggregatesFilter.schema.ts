import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { paymentstatusSchema } from '../enums/paymentstatus.schema';
import { NestedEnumpaymentstatusNullableWithAggregatesFilterObjectSchema as NestedEnumpaymentstatusNullableWithAggregatesFilterObjectSchema } from './NestedEnumpaymentstatusNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumpaymentstatusNullableFilterObjectSchema as NestedEnumpaymentstatusNullableFilterObjectSchema } from './NestedEnumpaymentstatusNullableFilter.schema'

const makeSchema = () => z.object({
  equals: paymentstatusSchema.optional().nullable(),
  in: paymentstatusSchema.array().optional().nullable(),
  notIn: paymentstatusSchema.array().optional().nullable(),
  not: z.union([paymentstatusSchema, z.lazy(() => NestedEnumpaymentstatusNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumpaymentstatusNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumpaymentstatusNullableFilterObjectSchema).optional()
}).strict();
export const EnumpaymentstatusNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumpaymentstatusNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumpaymentstatusNullableWithAggregatesFilter>;
export const EnumpaymentstatusNullableWithAggregatesFilterObjectZodSchema = makeSchema();
