import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ActivityStatusSchema } from '../enums/ActivityStatus.schema';
import { NestedEnumActivityStatusFilterObjectSchema as NestedEnumActivityStatusFilterObjectSchema } from './NestedEnumActivityStatusFilter.schema'

const makeSchema = () => z.object({
  equals: ActivityStatusSchema.optional(),
  in: ActivityStatusSchema.array().optional(),
  notIn: ActivityStatusSchema.array().optional(),
  not: z.union([ActivityStatusSchema, z.lazy(() => NestedEnumActivityStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumActivityStatusFilterObjectSchema: z.ZodType<Prisma.EnumActivityStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumActivityStatusFilter>;
export const EnumActivityStatusFilterObjectZodSchema = makeSchema();
