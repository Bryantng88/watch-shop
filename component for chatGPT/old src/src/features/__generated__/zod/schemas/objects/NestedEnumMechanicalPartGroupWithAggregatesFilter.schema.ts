import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartGroupSchema } from '../enums/MechanicalPartGroup.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMechanicalPartGroupFilterObjectSchema as NestedEnumMechanicalPartGroupFilterObjectSchema } from './NestedEnumMechanicalPartGroupFilter.schema'

const nestedenummechanicalpartgroupwithaggregatesfilterSchema = z.object({
  equals: MechanicalPartGroupSchema.optional(),
  in: MechanicalPartGroupSchema.array().optional(),
  notIn: MechanicalPartGroupSchema.array().optional(),
  not: z.union([MechanicalPartGroupSchema, z.lazy(() => NestedEnumMechanicalPartGroupWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMechanicalPartGroupFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMechanicalPartGroupFilterObjectSchema).optional()
}).strict();
export const NestedEnumMechanicalPartGroupWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumMechanicalPartGroupWithAggregatesFilter> = nestedenummechanicalpartgroupwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMechanicalPartGroupWithAggregatesFilter>;
export const NestedEnumMechanicalPartGroupWithAggregatesFilterObjectZodSchema = nestedenummechanicalpartgroupwithaggregatesfilterSchema;
