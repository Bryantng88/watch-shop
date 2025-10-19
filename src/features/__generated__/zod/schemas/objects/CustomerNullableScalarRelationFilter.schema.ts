import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => CustomerWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => CustomerWhereInputObjectSchema).optional().nullable()
}).strict();
export const CustomerNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.CustomerNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.CustomerNullableScalarRelationFilter>;
export const CustomerNullableScalarRelationFilterObjectZodSchema = makeSchema();
