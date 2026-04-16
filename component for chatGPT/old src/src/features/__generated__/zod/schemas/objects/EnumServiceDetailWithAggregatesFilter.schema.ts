import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema';
import { NestedEnumServiceDetailWithAggregatesFilterObjectSchema as NestedEnumServiceDetailWithAggregatesFilterObjectSchema } from './NestedEnumServiceDetailWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumServiceDetailFilterObjectSchema as NestedEnumServiceDetailFilterObjectSchema } from './NestedEnumServiceDetailFilter.schema'

const makeSchema = () => z.object({
  equals: ServiceDetailSchema.optional(),
  in: ServiceDetailSchema.array().optional(),
  notIn: ServiceDetailSchema.array().optional(),
  not: z.union([ServiceDetailSchema, z.lazy(() => NestedEnumServiceDetailWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumServiceDetailFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumServiceDetailFilterObjectSchema).optional()
}).strict();
export const EnumServiceDetailWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumServiceDetailWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumServiceDetailWithAggregatesFilter>;
export const EnumServiceDetailWithAggregatesFilterObjectZodSchema = makeSchema();
