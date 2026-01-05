import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { paymentdirectionSchema } from '../enums/paymentdirection.schema';
import { NestedEnumpaymentdirectionNullableFilterObjectSchema as NestedEnumpaymentdirectionNullableFilterObjectSchema } from './NestedEnumpaymentdirectionNullableFilter.schema'

const makeSchema = () => z.object({
  equals: paymentdirectionSchema.optional().nullable(),
  in: paymentdirectionSchema.array().optional().nullable(),
  notIn: paymentdirectionSchema.array().optional().nullable(),
  not: z.union([paymentdirectionSchema, z.lazy(() => NestedEnumpaymentdirectionNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumpaymentdirectionNullableFilterObjectSchema: z.ZodType<Prisma.EnumpaymentdirectionNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumpaymentdirectionNullableFilter>;
export const EnumpaymentdirectionNullableFilterObjectZodSchema = makeSchema();
