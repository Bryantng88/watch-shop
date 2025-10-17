import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseMaterialSchema } from '../enums/CaseMaterial.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumCaseMaterialFilterObjectSchema as NestedEnumCaseMaterialFilterObjectSchema } from './NestedEnumCaseMaterialFilter.schema'

const nestedenumcasematerialwithaggregatesfilterSchema = z.object({
  equals: CaseMaterialSchema.optional(),
  in: CaseMaterialSchema.array().optional(),
  notIn: CaseMaterialSchema.array().optional(),
  not: z.union([CaseMaterialSchema, z.lazy(() => NestedEnumCaseMaterialWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumCaseMaterialFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumCaseMaterialFilterObjectSchema).optional()
}).strict();
export const NestedEnumCaseMaterialWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumCaseMaterialWithAggregatesFilter> = nestedenumcasematerialwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumCaseMaterialWithAggregatesFilter>;
export const NestedEnumCaseMaterialWithAggregatesFilterObjectZodSchema = nestedenumcasematerialwithaggregatesfilterSchema;
