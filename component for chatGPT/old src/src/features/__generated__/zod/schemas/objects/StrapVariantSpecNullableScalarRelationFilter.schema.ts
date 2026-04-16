import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapVariantSpecWhereInputObjectSchema as StrapVariantSpecWhereInputObjectSchema } from './StrapVariantSpecWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => StrapVariantSpecWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => StrapVariantSpecWhereInputObjectSchema).optional().nullable()
}).strict();
export const StrapVariantSpecNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.StrapVariantSpecNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecNullableScalarRelationFilter>;
export const StrapVariantSpecNullableScalarRelationFilterObjectZodSchema = makeSchema();
