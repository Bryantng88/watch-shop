import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectWhereInputObjectSchema as MediaObjectWhereInputObjectSchema } from './MediaObjectWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => MediaObjectWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => MediaObjectWhereInputObjectSchema).optional()
}).strict();
export const MediaObjectScalarRelationFilterObjectSchema: z.ZodType<Prisma.MediaObjectScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectScalarRelationFilter>;
export const MediaObjectScalarRelationFilterObjectZodSchema = makeSchema();
