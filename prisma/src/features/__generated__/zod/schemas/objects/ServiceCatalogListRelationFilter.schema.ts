import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional(),
  some: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional(),
  none: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional()
}).strict();
export const ServiceCatalogListRelationFilterObjectSchema: z.ZodType<Prisma.ServiceCatalogListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogListRelationFilter>;
export const ServiceCatalogListRelationFilterObjectZodSchema = makeSchema();
