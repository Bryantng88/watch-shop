import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentDirectionSchema } from '../enums/PaymentDirection.schema';
import { NestedEnumPaymentDirectionNullableFilterObjectSchema as NestedEnumPaymentDirectionNullableFilterObjectSchema } from './NestedEnumPaymentDirectionNullableFilter.schema'

const makeSchema = () => z.object({
  equals: PaymentDirectionSchema.optional().nullable(),
  in: PaymentDirectionSchema.array().optional().nullable(),
  notIn: PaymentDirectionSchema.array().optional().nullable(),
  not: z.union([PaymentDirectionSchema, z.lazy(() => NestedEnumPaymentDirectionNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumPaymentDirectionNullableFilterObjectSchema: z.ZodType<Prisma.EnumPaymentDirectionNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPaymentDirectionNullableFilter>;
export const EnumPaymentDirectionNullableFilterObjectZodSchema = makeSchema();
