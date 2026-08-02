import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ClaspVariantSpecSelectObjectSchema as ClaspVariantSpecSelectObjectSchema } from './ClaspVariantSpecSelect.schema';
import { ClaspVariantSpecIncludeObjectSchema as ClaspVariantSpecIncludeObjectSchema } from './ClaspVariantSpecInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ClaspVariantSpecSelectObjectSchema).optional(),
  include: z.lazy(() => ClaspVariantSpecIncludeObjectSchema).optional()
}).strict();
export const ClaspVariantSpecArgsObjectSchema = makeSchema();
export const ClaspVariantSpecArgsObjectZodSchema = makeSchema();
