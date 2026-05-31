import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PostTargetWhereInputObjectSchema as PostTargetWhereInputObjectSchema } from './PostTargetWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => PostTargetWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => PostTargetWhereInputObjectSchema).optional()
}).strict();
export const PostTargetScalarRelationFilterObjectSchema: z.ZodType<Prisma.PostTargetScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetScalarRelationFilter>;
export const PostTargetScalarRelationFilterObjectZodSchema = makeSchema();
