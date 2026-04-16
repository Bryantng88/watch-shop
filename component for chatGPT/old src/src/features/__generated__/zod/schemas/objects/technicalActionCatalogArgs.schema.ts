import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalActionCatalogSelectObjectSchema as technicalActionCatalogSelectObjectSchema } from './technicalActionCatalogSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => technicalActionCatalogSelectObjectSchema).optional()
}).strict();
export const technicalActionCatalogArgsObjectSchema = makeSchema();
export const technicalActionCatalogArgsObjectZodSchema = makeSchema();
