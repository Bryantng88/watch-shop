import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartCatalogWhereInputObjectSchema as MechanicalPartCatalogWhereInputObjectSchema } from './MechanicalPartCatalogWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema).optional().nullable()
}).strict();
export const MechanicalPartCatalogNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogNullableScalarRelationFilter>;
export const MechanicalPartCatalogNullableScalarRelationFilterObjectZodSchema = makeSchema();
