import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetFindManySchema as ProductPostTargetFindManySchema } from '../findManyProductPostTarget.schema';
import { PostTargetCountOutputTypeArgsObjectSchema as PostTargetCountOutputTypeArgsObjectSchema } from './PostTargetCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  products: z.union([z.boolean(), z.lazy(() => ProductPostTargetFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PostTargetCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const PostTargetIncludeObjectSchema: z.ZodType<Prisma.PostTargetInclude> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetInclude>;
export const PostTargetIncludeObjectZodSchema = makeSchema();
