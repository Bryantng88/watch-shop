import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { paymentdirectionSchema } from '../enums/paymentdirection.schema'

const nestedenumpaymentdirectionnullablefilterSchema = z.object({
  equals: paymentdirectionSchema.optional().nullable(),
  in: paymentdirectionSchema.array().optional().nullable(),
  notIn: paymentdirectionSchema.array().optional().nullable(),
  not: z.union([paymentdirectionSchema, z.lazy(() => NestedEnumpaymentdirectionNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumpaymentdirectionNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumpaymentdirectionNullableFilter> = nestedenumpaymentdirectionnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumpaymentdirectionNullableFilter>;
export const NestedEnumpaymentdirectionNullableFilterObjectZodSchema = nestedenumpaymentdirectionnullablefilterSchema;
