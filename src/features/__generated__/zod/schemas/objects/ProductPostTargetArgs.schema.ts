import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetSelectObjectSchema as ProductPostTargetSelectObjectSchema } from './ProductPostTargetSelect.schema';
import { ProductPostTargetIncludeObjectSchema as ProductPostTargetIncludeObjectSchema } from './ProductPostTargetInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ProductPostTargetSelectObjectSchema).optional(),
  include: z.lazy(() => ProductPostTargetIncludeObjectSchema).optional()
}).strict();
export const ProductPostTargetArgsObjectSchema = makeSchema();
export const ProductPostTargetArgsObjectZodSchema = makeSchema();
