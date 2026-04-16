import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAppearanceIssueCatalogSelectObjectSchema as technicalAppearanceIssueCatalogSelectObjectSchema } from './technicalAppearanceIssueCatalogSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => technicalAppearanceIssueCatalogSelectObjectSchema).optional()
}).strict();
export const technicalAppearanceIssueCatalogArgsObjectSchema = makeSchema();
export const technicalAppearanceIssueCatalogArgsObjectZodSchema = makeSchema();
