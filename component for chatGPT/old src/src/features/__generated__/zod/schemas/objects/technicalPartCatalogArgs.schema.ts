import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalPartCatalogSelectObjectSchema as technicalPartCatalogSelectObjectSchema } from './technicalPartCatalogSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => technicalPartCatalogSelectObjectSchema).optional()
}).strict();
export const technicalPartCatalogArgsObjectSchema = makeSchema();
export const technicalPartCatalogArgsObjectZodSchema = makeSchema();
