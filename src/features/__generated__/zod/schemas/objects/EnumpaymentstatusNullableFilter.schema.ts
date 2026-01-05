import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { paymentstatusSchema } from '../enums/paymentstatus.schema';
import { NestedEnumpaymentstatusNullableFilterObjectSchema as NestedEnumpaymentstatusNullableFilterObjectSchema } from './NestedEnumpaymentstatusNullableFilter.schema'

const makeSchema = () => z.object({
  equals: paymentstatusSchema.optional().nullable(),
  in: paymentstatusSchema.array().optional().nullable(),
  notIn: paymentstatusSchema.array().optional().nullable(),
  not: z.union([paymentstatusSchema, z.lazy(() => NestedEnumpaymentstatusNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumpaymentstatusNullableFilterObjectSchema: z.ZodType<Prisma.EnumpaymentstatusNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumpaymentstatusNullableFilter>;
export const EnumpaymentstatusNullableFilterObjectZodSchema = makeSchema();
