import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogCountOutputTypeSelectObjectSchema as ServiceCatalogCountOutputTypeSelectObjectSchema } from './ServiceCatalogCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ServiceCatalogCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const ServiceCatalogCountOutputTypeArgsObjectSchema = makeSchema();
export const ServiceCatalogCountOutputTypeArgsObjectZodSchema = makeSchema();
