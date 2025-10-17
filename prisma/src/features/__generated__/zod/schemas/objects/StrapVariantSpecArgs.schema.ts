import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapVariantSpecSelectObjectSchema as StrapVariantSpecSelectObjectSchema } from './StrapVariantSpecSelect.schema';
import { StrapVariantSpecIncludeObjectSchema as StrapVariantSpecIncludeObjectSchema } from './StrapVariantSpecInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => StrapVariantSpecSelectObjectSchema).optional(),
  include: z.lazy(() => StrapVariantSpecIncludeObjectSchema).optional()
}).strict();
export const StrapVariantSpecArgsObjectSchema = makeSchema();
export const StrapVariantSpecArgsObjectZodSchema = makeSchema();
