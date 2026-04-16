import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './ServiceCatalogWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => ServiceCatalogWhereInputObjectSchema).optional().nullable()
}).strict();
export const ServiceCatalogNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.ServiceCatalogNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogNullableScalarRelationFilter>;
export const ServiceCatalogNullableScalarRelationFilterObjectZodSchema = makeSchema();
