import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapCatalogOptionSelectObjectSchema as StrapCatalogOptionSelectObjectSchema } from './StrapCatalogOptionSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => StrapCatalogOptionSelectObjectSchema).optional()
}).strict();
export const StrapCatalogOptionArgsObjectSchema = makeSchema();
export const StrapCatalogOptionArgsObjectZodSchema = makeSchema();
