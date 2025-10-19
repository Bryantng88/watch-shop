import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseMaterialSchema } from '../enums/CaseMaterial.schema';
import { NestedEnumCaseMaterialWithAggregatesFilterObjectSchema as NestedEnumCaseMaterialWithAggregatesFilterObjectSchema } from './NestedEnumCaseMaterialWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumCaseMaterialFilterObjectSchema as NestedEnumCaseMaterialFilterObjectSchema } from './NestedEnumCaseMaterialFilter.schema'

const makeSchema = () => z.object({
  equals: CaseMaterialSchema.optional(),
  in: CaseMaterialSchema.array().optional(),
  notIn: CaseMaterialSchema.array().optional(),
  not: z.union([CaseMaterialSchema, z.lazy(() => NestedEnumCaseMaterialWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumCaseMaterialFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumCaseMaterialFilterObjectSchema).optional()
}).strict();
export const EnumCaseMaterialWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumCaseMaterialWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCaseMaterialWithAggregatesFilter>;
export const EnumCaseMaterialWithAggregatesFilterObjectZodSchema = makeSchema();
