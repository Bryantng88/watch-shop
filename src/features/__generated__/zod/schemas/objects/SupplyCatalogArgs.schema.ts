import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SupplyCatalogSelectObjectSchema as SupplyCatalogSelectObjectSchema } from './SupplyCatalogSelect.schema';
import { SupplyCatalogIncludeObjectSchema as SupplyCatalogIncludeObjectSchema } from './SupplyCatalogInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SupplyCatalogSelectObjectSchema).optional(),
  include: z.lazy(() => SupplyCatalogIncludeObjectSchema).optional()
}).strict();
export const SupplyCatalogArgsObjectSchema = makeSchema();
export const SupplyCatalogArgsObjectZodSchema = makeSchema();
