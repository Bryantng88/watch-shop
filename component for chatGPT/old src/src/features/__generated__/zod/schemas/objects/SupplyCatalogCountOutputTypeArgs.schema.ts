import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SupplyCatalogCountOutputTypeSelectObjectSchema as SupplyCatalogCountOutputTypeSelectObjectSchema } from './SupplyCatalogCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SupplyCatalogCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const SupplyCatalogCountOutputTypeArgsObjectSchema = makeSchema();
export const SupplyCatalogCountOutputTypeArgsObjectZodSchema = makeSchema();
