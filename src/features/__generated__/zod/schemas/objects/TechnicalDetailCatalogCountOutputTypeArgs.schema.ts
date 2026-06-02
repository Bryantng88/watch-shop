import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalDetailCatalogCountOutputTypeSelectObjectSchema as TechnicalDetailCatalogCountOutputTypeSelectObjectSchema } from './TechnicalDetailCatalogCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TechnicalDetailCatalogCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const TechnicalDetailCatalogCountOutputTypeArgsObjectSchema = makeSchema();
export const TechnicalDetailCatalogCountOutputTypeArgsObjectZodSchema = makeSchema();
