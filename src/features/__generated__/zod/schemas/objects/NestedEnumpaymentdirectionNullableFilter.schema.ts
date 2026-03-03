import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentDirectionSchema } from '../enums/PaymentDirection.schema'

const nestedenumpaymentdirectionnullablefilterSchema = z.object({
  equals: PaymentDirectionSchema.optional().nullable(),
  in: PaymentDirectionSchema.array().optional().nullable(),
  notIn: PaymentDirectionSchema.array().optional().nullable(),
  not: z.union([PaymentDirectionSchema, z.lazy(() => NestedEnumPaymentDirectionNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumPaymentDirectionNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumPaymentDirectionNullableFilter> = nestedenumpaymentdirectionnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumPaymentDirectionNullableFilter>;
export const NestedEnumPaymentDirectionNullableFilterObjectZodSchema = nestedenumpaymentdirectionnullablefilterSchema;
