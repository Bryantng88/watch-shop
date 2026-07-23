import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectWhereInputObjectSchema as MediaObjectWhereInputObjectSchema } from './MediaObjectWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => MediaObjectWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => MediaObjectWhereInputObjectSchema).optional().nullable()
}).strict();
export const MediaObjectNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.MediaObjectNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectNullableScalarRelationFilter>;
export const MediaObjectNullableScalarRelationFilterObjectZodSchema = makeSchema();
