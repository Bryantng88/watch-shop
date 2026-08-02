import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapCatalogOptionKindSchema } from '../enums/StrapCatalogOptionKind.schema'

const nestedenumstrapcatalogoptionkindfilterSchema = z.object({
  equals: StrapCatalogOptionKindSchema.optional(),
  in: StrapCatalogOptionKindSchema.array().optional(),
  notIn: StrapCatalogOptionKindSchema.array().optional(),
  not: z.union([StrapCatalogOptionKindSchema, z.lazy(() => NestedEnumStrapCatalogOptionKindFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumStrapCatalogOptionKindFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapCatalogOptionKindFilter> = nestedenumstrapcatalogoptionkindfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapCatalogOptionKindFilter>;
export const NestedEnumStrapCatalogOptionKindFilterObjectZodSchema = nestedenumstrapcatalogoptionkindfilterSchema;
