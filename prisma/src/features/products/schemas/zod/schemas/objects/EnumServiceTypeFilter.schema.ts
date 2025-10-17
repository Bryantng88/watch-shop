import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { NestedEnumServiceTypeFilterObjectSchema as NestedEnumServiceTypeFilterObjectSchema } from './NestedEnumServiceTypeFilter.schema'

const makeSchema = () => z.object({
  equals: ServiceTypeSchema.optional(),
  in: ServiceTypeSchema.array().optional(),
  notIn: ServiceTypeSchema.array().optional(),
  not: z.union([ServiceTypeSchema, z.lazy(() => NestedEnumServiceTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumServiceTypeFilterObjectSchema: z.ZodType<Prisma.EnumServiceTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumServiceTypeFilter>;
export const EnumServiceTypeFilterObjectZodSchema = makeSchema();
