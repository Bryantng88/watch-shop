import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => OrderItemWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => OrderItemWhereInputObjectSchema).optional().nullable()
}).strict();
export const OrderItemNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.OrderItemNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemNullableScalarRelationFilter>;
export const OrderItemNullableScalarRelationFilterObjectZodSchema = makeSchema();
