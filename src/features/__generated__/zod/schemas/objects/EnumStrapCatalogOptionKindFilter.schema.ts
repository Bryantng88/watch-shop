import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapCatalogOptionKindSchema } from '../enums/StrapCatalogOptionKind.schema';
import { NestedEnumStrapCatalogOptionKindFilterObjectSchema as NestedEnumStrapCatalogOptionKindFilterObjectSchema } from './NestedEnumStrapCatalogOptionKindFilter.schema'

const makeSchema = () => z.object({
  equals: StrapCatalogOptionKindSchema.optional(),
  in: StrapCatalogOptionKindSchema.array().optional(),
  notIn: StrapCatalogOptionKindSchema.array().optional(),
  not: z.union([StrapCatalogOptionKindSchema, z.lazy(() => NestedEnumStrapCatalogOptionKindFilterObjectSchema)]).optional()
}).strict();
export const EnumStrapCatalogOptionKindFilterObjectSchema: z.ZodType<Prisma.EnumStrapCatalogOptionKindFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapCatalogOptionKindFilter>;
export const EnumStrapCatalogOptionKindFilterObjectZodSchema = makeSchema();
