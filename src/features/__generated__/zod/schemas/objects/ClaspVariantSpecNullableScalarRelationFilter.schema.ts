import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ClaspVariantSpecWhereInputObjectSchema as ClaspVariantSpecWhereInputObjectSchema } from './ClaspVariantSpecWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ClaspVariantSpecWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => ClaspVariantSpecWhereInputObjectSchema).optional().nullable()
}).strict();
export const ClaspVariantSpecNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.ClaspVariantSpecNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecNullableScalarRelationFilter>;
export const ClaspVariantSpecNullableScalarRelationFilterObjectZodSchema = makeSchema();
