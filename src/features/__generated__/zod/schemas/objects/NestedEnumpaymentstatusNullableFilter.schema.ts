import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { paymentstatusSchema } from '../enums/paymentstatus.schema'

const nestedenumpaymentstatusnullablefilterSchema = z.object({
  equals: paymentstatusSchema.optional().nullable(),
  in: paymentstatusSchema.array().optional().nullable(),
  notIn: paymentstatusSchema.array().optional().nullable(),
  not: z.union([paymentstatusSchema, z.lazy(() => NestedEnumpaymentstatusNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumpaymentstatusNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumpaymentstatusNullableFilter> = nestedenumpaymentstatusnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumpaymentstatusNullableFilter>;
export const NestedEnumpaymentstatusNullableFilterObjectZodSchema = nestedenumpaymentstatusnullablefilterSchema;
