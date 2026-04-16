import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartGroupSchema } from '../enums/MechanicalPartGroup.schema'

const nestedenummechanicalpartgroupfilterSchema = z.object({
  equals: MechanicalPartGroupSchema.optional(),
  in: MechanicalPartGroupSchema.array().optional(),
  notIn: MechanicalPartGroupSchema.array().optional(),
  not: z.union([MechanicalPartGroupSchema, z.lazy(() => NestedEnumMechanicalPartGroupFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumMechanicalPartGroupFilterObjectSchema: z.ZodType<Prisma.NestedEnumMechanicalPartGroupFilter> = nestedenummechanicalpartgroupfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMechanicalPartGroupFilter>;
export const NestedEnumMechanicalPartGroupFilterObjectZodSchema = nestedenummechanicalpartgroupfilterSchema;
