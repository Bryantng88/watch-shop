import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => OrderItemWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => OrderItemWhereInputObjectSchema).optional()
}).strict();
export const OrderItemScalarRelationFilterObjectSchema: z.ZodType<Prisma.OrderItemScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemScalarRelationFilter>;
export const OrderItemScalarRelationFilterObjectZodSchema = makeSchema();
