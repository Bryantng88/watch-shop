import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartVariantSpecWhereInputObjectSchema as PartVariantSpecWhereInputObjectSchema } from './PartVariantSpecWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => PartVariantSpecWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => PartVariantSpecWhereInputObjectSchema).optional().nullable()
}).strict();
export const PartVariantSpecNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.PartVariantSpecNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecNullableScalarRelationFilter>;
export const PartVariantSpecNullableScalarRelationFilterObjectZodSchema = makeSchema();
