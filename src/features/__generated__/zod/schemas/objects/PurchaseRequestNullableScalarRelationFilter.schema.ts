import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => PurchaseRequestWhereInputObjectSchema).optional().nullable()
}).strict();
export const PurchaseRequestNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.PurchaseRequestNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestNullableScalarRelationFilter>;
export const PurchaseRequestNullableScalarRelationFilterObjectZodSchema = makeSchema();
