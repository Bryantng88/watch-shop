import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapCatalogOptionKindSchema } from '../enums/StrapCatalogOptionKind.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStrapCatalogOptionKindFilterObjectSchema as NestedEnumStrapCatalogOptionKindFilterObjectSchema } from './NestedEnumStrapCatalogOptionKindFilter.schema'

const nestedenumstrapcatalogoptionkindwithaggregatesfilterSchema = z.object({
  equals: StrapCatalogOptionKindSchema.optional(),
  in: StrapCatalogOptionKindSchema.array().optional(),
  notIn: StrapCatalogOptionKindSchema.array().optional(),
  not: z.union([StrapCatalogOptionKindSchema, z.lazy(() => NestedEnumStrapCatalogOptionKindWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapCatalogOptionKindFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapCatalogOptionKindFilterObjectSchema).optional()
}).strict();
export const NestedEnumStrapCatalogOptionKindWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapCatalogOptionKindWithAggregatesFilter> = nestedenumstrapcatalogoptionkindwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapCatalogOptionKindWithAggregatesFilter>;
export const NestedEnumStrapCatalogOptionKindWithAggregatesFilterObjectZodSchema = nestedenumstrapcatalogoptionkindwithaggregatesfilterSchema;
