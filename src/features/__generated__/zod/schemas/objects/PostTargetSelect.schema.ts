import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetFindManySchema as ProductPostTargetFindManySchema } from '../findManyProductPostTarget.schema';
import { PostTargetCountOutputTypeArgsObjectSchema as PostTargetCountOutputTypeArgsObjectSchema } from './PostTargetCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  platform: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  products: z.union([z.boolean(), z.lazy(() => ProductPostTargetFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PostTargetCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const PostTargetSelectObjectSchema: z.ZodType<Prisma.PostTargetSelect> = makeSchema() as unknown as z.ZodType<Prisma.PostTargetSelect>;
export const PostTargetSelectObjectZodSchema = makeSchema();
