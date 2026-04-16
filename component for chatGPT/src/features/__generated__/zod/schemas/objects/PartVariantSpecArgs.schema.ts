import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartVariantSpecSelectObjectSchema as PartVariantSpecSelectObjectSchema } from './PartVariantSpecSelect.schema';
import { PartVariantSpecIncludeObjectSchema as PartVariantSpecIncludeObjectSchema } from './PartVariantSpecInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PartVariantSpecSelectObjectSchema).optional(),
  include: z.lazy(() => PartVariantSpecIncludeObjectSchema).optional()
}).strict();
export const PartVariantSpecArgsObjectSchema = makeSchema();
export const PartVariantSpecArgsObjectZodSchema = makeSchema();
