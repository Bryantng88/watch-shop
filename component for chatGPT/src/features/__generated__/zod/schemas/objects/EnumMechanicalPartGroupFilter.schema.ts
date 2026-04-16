import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartGroupSchema } from '../enums/MechanicalPartGroup.schema';
import { NestedEnumMechanicalPartGroupFilterObjectSchema as NestedEnumMechanicalPartGroupFilterObjectSchema } from './NestedEnumMechanicalPartGroupFilter.schema'

const makeSchema = () => z.object({
  equals: MechanicalPartGroupSchema.optional(),
  in: MechanicalPartGroupSchema.array().optional(),
  notIn: MechanicalPartGroupSchema.array().optional(),
  not: z.union([MechanicalPartGroupSchema, z.lazy(() => NestedEnumMechanicalPartGroupFilterObjectSchema)]).optional()
}).strict();
export const EnumMechanicalPartGroupFilterObjectSchema: z.ZodType<Prisma.EnumMechanicalPartGroupFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMechanicalPartGroupFilter>;
export const EnumMechanicalPartGroupFilterObjectZodSchema = makeSchema();
