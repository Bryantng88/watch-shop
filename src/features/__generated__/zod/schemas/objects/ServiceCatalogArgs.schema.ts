import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogSelectObjectSchema as ServiceCatalogSelectObjectSchema } from './ServiceCatalogSelect.schema';
import { ServiceCatalogIncludeObjectSchema as ServiceCatalogIncludeObjectSchema } from './ServiceCatalogInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ServiceCatalogSelectObjectSchema).optional(),
  include: z.lazy(() => ServiceCatalogIncludeObjectSchema).optional()
}).strict();
export const ServiceCatalogArgsObjectSchema = makeSchema();
export const ServiceCatalogArgsObjectZodSchema = makeSchema();
