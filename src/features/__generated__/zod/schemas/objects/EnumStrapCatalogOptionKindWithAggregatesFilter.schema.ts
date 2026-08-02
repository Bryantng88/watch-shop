import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapCatalogOptionKindSchema } from '../enums/StrapCatalogOptionKind.schema';
import { NestedEnumStrapCatalogOptionKindWithAggregatesFilterObjectSchema as NestedEnumStrapCatalogOptionKindWithAggregatesFilterObjectSchema } from './NestedEnumStrapCatalogOptionKindWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStrapCatalogOptionKindFilterObjectSchema as NestedEnumStrapCatalogOptionKindFilterObjectSchema } from './NestedEnumStrapCatalogOptionKindFilter.schema'

const makeSchema = () => z.object({
  equals: StrapCatalogOptionKindSchema.optional(),
  in: StrapCatalogOptionKindSchema.array().optional(),
  notIn: StrapCatalogOptionKindSchema.array().optional(),
  not: z.union([StrapCatalogOptionKindSchema, z.lazy(() => NestedEnumStrapCatalogOptionKindWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapCatalogOptionKindFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapCatalogOptionKindFilterObjectSchema).optional()
}).strict();
export const EnumStrapCatalogOptionKindWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumStrapCatalogOptionKindWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapCatalogOptionKindWithAggregatesFilter>;
export const EnumStrapCatalogOptionKindWithAggregatesFilterObjectZodSchema = makeSchema();
