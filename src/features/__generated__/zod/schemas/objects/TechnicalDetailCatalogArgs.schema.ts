import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalDetailCatalogSelectObjectSchema as TechnicalDetailCatalogSelectObjectSchema } from './TechnicalDetailCatalogSelect.schema';
import { TechnicalDetailCatalogIncludeObjectSchema as TechnicalDetailCatalogIncludeObjectSchema } from './TechnicalDetailCatalogInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TechnicalDetailCatalogSelectObjectSchema).optional(),
  include: z.lazy(() => TechnicalDetailCatalogIncludeObjectSchema).optional()
}).strict();
export const TechnicalDetailCatalogArgsObjectSchema = makeSchema();
export const TechnicalDetailCatalogArgsObjectZodSchema = makeSchema();
