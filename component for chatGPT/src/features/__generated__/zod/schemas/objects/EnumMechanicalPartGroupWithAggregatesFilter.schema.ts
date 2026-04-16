import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartGroupSchema } from '../enums/MechanicalPartGroup.schema';
import { NestedEnumMechanicalPartGroupWithAggregatesFilterObjectSchema as NestedEnumMechanicalPartGroupWithAggregatesFilterObjectSchema } from './NestedEnumMechanicalPartGroupWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMechanicalPartGroupFilterObjectSchema as NestedEnumMechanicalPartGroupFilterObjectSchema } from './NestedEnumMechanicalPartGroupFilter.schema'

const makeSchema = () => z.object({
  equals: MechanicalPartGroupSchema.optional(),
  in: MechanicalPartGroupSchema.array().optional(),
  notIn: MechanicalPartGroupSchema.array().optional(),
  not: z.union([MechanicalPartGroupSchema, z.lazy(() => NestedEnumMechanicalPartGroupWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMechanicalPartGroupFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMechanicalPartGroupFilterObjectSchema).optional()
}).strict();
export const EnumMechanicalPartGroupWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumMechanicalPartGroupWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMechanicalPartGroupWithAggregatesFilter>;
export const EnumMechanicalPartGroupWithAggregatesFilterObjectZodSchema = makeSchema();
