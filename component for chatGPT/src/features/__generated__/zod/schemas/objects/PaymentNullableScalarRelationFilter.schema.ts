import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentWhereInputObjectSchema as PaymentWhereInputObjectSchema } from './PaymentWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => PaymentWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => PaymentWhereInputObjectSchema).optional().nullable()
}).strict();
export const PaymentNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.PaymentNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.PaymentNullableScalarRelationFilter>;
export const PaymentNullableScalarRelationFilterObjectZodSchema = makeSchema();
